import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { question, nsqipPage, patient, pqs, answer, patientWithAnswers, pqError } from './nsqipQuestions';
import { of } from 'rxjs/observable/of'

import { tap, catchError } from 'rxjs/operators'
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { unescapeIdentifier } from '@angular/compiler';

// @Injectable()
// export class AppLoadSvc {

//   constructor(private http: HttpClient, private q: NsqipService) {}

//   getURL() {


//     let path = 'assets/url.json'
//     let promise = this.http.get(path)
//                   .toPromise()
//                   .then(settings => {

//                     this.q.xurl = settings.url;


//                     console.log('here')
//                     return settings
//                   })
//     return promise

//   }
// }

 @Injectable()
export class NsqipService {

         url: string;// = 'http://localhost:55474/nsqip';
         //url = 'https://myapps.uat.nyp.org/Nsqipsurveyapi/nsqip'

         xurl: string;
         path: string = null;
         pathid: string = null

         savedQuestions         : question[]         = null;
         savedPages             : nsqipPage[]        = null;
         savedPatient           : patient            = null;
         savedPatientWithAnswers: patientWithAnswers = null
         savedPQs               : pqs                = null;

         aorc                   : string;
         language               : string;
         langNumber             : number;
         langDictionary =
                         {
                           'Server error, please try later'                      : ['', 'Error del servidor, por favor intente más tarde'],
                           'Thank you'                                           : ['', 'Gracias'  ],
                           'Close Survey'                                        : ['','Encuesta Cercana'],
                           'Welcome'                                             : ['','Bienvenido'],
                           'Start Survey'                                        : ['','Empezar encuesta'],
                           'Survey'                                              : ['','Encuesta'],
                           'Next'                                                : ['','Siguiente'],
                           'Yes'                                                 : ['','Si'],
                           'No'                                                  : ['','No'],
                           'Incorrect birth date'                                : ['', 'fecha de nacimiento incorrecta'],
                           'dob'                                                 : ['Please enter your Date of Birth', 'Por favor, introduzca su fecha de nacimiento', 'Please enter the patient\'s Date of Birth', 'Por favor ingrese la fecha de nacimiento del paciente'],
                           'Before we begin please help us verify your identity.': ['','Antes de comenzar, ayúdenos a verificar su identidad.'],
                           };

  constructor(private http: HttpClient) { }

  getPatientWithAnswers() : patientWithAnswers {

    let x = this.savedPQs.patientWithAnswers;
    return x;
  }

  chgLanguage(lang: string) : void {

    this.language = lang;

    if ( ( this.savedPQs != null ) && (this.savedPQs.patient != null)) {

      this.savedPQs.patient.patientLanguage                    = lang;
      this.savedPQs.patientWithAnswers.patient.patientLanguage = lang;
    }

  }

  getString(msg: string): string {

    let amsg: string[] = this.langDictionary[msg];

    if ( ( amsg == undefined) || (amsg == null) || (amsg.length == 0)) {

      return msg;

    }

    let aorcNumber = 0;
    let langNumber = ( this.language == "en" ) ? 0: 1;

    if ( ( this.savedPQs != null) && (this.savedPQs.patient != undefined)) {

      let aorc       = this.savedPQs.patient.patientType.toLowerCase().substring(0,1);
      aorcNumber = ( aorc          == 'a' ) ? 0 : 2;
      langNumber = ( this.language == "en" ) ? 0: 1;

    }

    //specific child messsages?
    if ( amsg.length == 2) {

      aorcNumber = 0;//no

    }

    let word = amsg[langNumber + aorcNumber ];

    if (word == '') {
        return msg;
    }

    return word;
  }

  postAnswers(apatient: patientWithAnswers): Observable<patient | pqError> {

      const httpOptions = {headers: new HttpHeaders({ 'Content-Type':  'application/json' })};

      let x = `${this.url}/PostAnswers`;

      return this.http.post<patient>(x, apatient, httpOptions)
              .pipe(
                    catchError(this.handleError)
                );
  }


getQuestions(id: string) : Observable<pqs | pqError> {

      if ( this.savedPQs != null) {

        return of(this.savedPQs)

      }

      this.savedPQs = JSON.parse(window.localStorage.getItem(id + 'pqs'))

      if ( this.savedPQs != null) {

        this.language = this.savedPQs.patient.patientLanguage;

        if (this.language == null) this.language = 'en';

        return of(this.savedPQs)

      }

      this.savedPatientWithAnswers = new patientWithAnswers();
      this.savedPQs                = new pqs();

      let x = `${this.url}/getquestions/${id}`;

      return this.http.get<pqs>(x)
          .pipe(

            catchError(err => this.handleError(err)),

            tap(
              (data: pqs)=> {

                this.savedQuestions = data.questions;
                this.savedPages = data.pages;

                for (let i = 0; i< this.savedPages.length; i++) {

                  let x = this.savedPages[i];
                  this.savedPages[i].pageType = x.pageQuestions[0].questionType

                }

                 this.savedPatient                    = data.patient;
                 this.savedPatientWithAnswers.patient = data.patient;

                 this.savedPatientWithAnswers.answers = [];

                 for (let i = 0; i< this.savedQuestions.length; i++) {

                  let x            = new answer();

                  x.questionNumber = this.savedQuestions[i].questionNo
                  x.questionText   = this.savedQuestions[i].questionText
                  x.questionType   = this.savedQuestions[i].questionType;
                  x.answer         = ""

                  this.savedPatientWithAnswers.answers[i] = x

                 }

                 this.language = data.patient.patientLanguage;

                 if (this.language == null) this.language = 'en';

                 //this.langNumber = ( this.language == "en" ) ? 0 : 1;

                 this.savedPQs.pages              = data.pages;
                 this.savedPQs.patient            = data.patient;
                 this.savedPQs.patientWithAnswers = this.savedPatientWithAnswers
                 this.savedPQs.questions = data.questions;

                window.localStorage.setItem(id + 'pqs', JSON.stringify(this.savedPQs))

                console.log('getquestions pipe:' + data);

              })
          );

    }

    private handleError(aError: HttpErrorResponse) : Observable<pqError> {

      let theError = new pqError();
      theError.httpError = aError;

      if (aError.error instanceof ErrorEvent) {

        theError.errType = 'client-side or network error'
        theError.errType = aError.error.error
        // A client-side or network error occurred. Handle it accordingly.
        console.log('An error occurred:', aError.error.error);

        //return new ErrorObservable(theError)

      }
      else {

        if (aError.error instanceof ProgressEvent) {
          //occurs when backend is down
            theError.errType = 'progess event error'
            theError.errMsg = aError.message;
        }
        else {

          theError.errType= 'backend returned bad response code : ' +aError.status
          theError.errMsg = aError.statusText;

          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.log(
            `Backend returned code ${aError.status}, ` +
            `body was: ${aError.statusText}`);
          }
      }

      // return an ErrorObservable with a user-facing error message
      return ErrorObservable.create(theError);
              //  'Something bad happened; please try again later.'
    }

}

 // getPages() : Observable<nsqipPage[]> {

    //   if ( this.savedPages == null) {

    //     let x = `${this.url}/getpages/${this.aorc}/${this.language}`;
    //     return this.http.get<nsqipPage[]>(x)
    //       .pipe(
    //         tap(data => {
    //           this.savedPages = data;
    //           console.log('getpages pipe:' + data);
    //         })
    //       );

    //   }
    //   else {

    //     return of(this.savedPages)
    //   }

    // }
    // getPatientOld(id: string) : Observable<patient> {

    //   if ( this.savedPatient == null) {

    //     let x = `${this.url}/getpatient/${id}}`;
    //     return this.http.get<patient>(x)
    //       .pipe(
    //         tap(
    //           data=> {this.savedPatient = data;
    //         console.log('getpatient pipe:' + data);
    //           }     )
    //         )
    //     ;
    //   }
    //   else {
    //     return of(this.savedPatient)
    //   }

    // }

  // getType(): string {
  //   return this.aorc;
  // }

    // getAllTheData() : Observable<allData>{
  //     this.alltheData = { pages: {}, questions: {}}
  //     this.alltheData.pages = this.savedPages;
  //     this.alltheData.questions = this.savedQuestions;
  //     return of(this.alltheData);

  // }

  // getLanguageType() : string {

  //   return this.language;

  // }

    // getPatient() : patient {

  //   let x = this.savedPatient;
  //   return x;

  // }

    // saveType(aorc: string) {
  //   this.aorc = aorc.toLowerCase();
  // }

    // saveLanguageType(lang: string) {

  //   this.language = lang;
  //   //this.langNumber = ( lang == "en" ) ? 0 : 1;
  //   this.savedQuestions = null;
  //   this.savedPages = null;

  // }
