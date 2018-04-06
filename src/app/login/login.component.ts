import { Component, OnInit, Renderer2, AfterViewInit, ElementRef, ViewChild, ViewChildren, QueryList } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ParamMap } from "@angular/router/src/shared";
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/debounceTime";

import { NsqipService } from "../nsqip.service";
import { pqs, pqError } from "../nsqipQuestions";
import { AbstractControl } from "@angular/forms/src/model";
import { flattenStyles } from "@angular/platform-browser/src/dom/dom_renderer";


@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChildren('mon, day, year') inputFields: QueryList<ElementRef>;
  @ViewChild('mon') firstField: ElementRef
  loginForm: FormGroup;
  dobMonth: number;
  dobDay  : number;
  dobYear : number;

  //adultMessage: string; // = this.getString("Please enter your Date of Birth")
  //childMessage: string; // = this.getString("Please enter the patient's Date of Birth")
  welcomeMessage: string;
  beginMsg      : string;
  startMsg      : string;
  dobMessage    : string;
  errorMsg      : string;
  hasErrors: boolean = false;

  pqs           : pqs;
  lang          : string;
  //aorc: string;
  displayMessage  = { dobMonth : '', dobDay: '', dobYear: '' }

  private validationMessages = {

    dobMonth : {
      required: 'Month is required',
      minlength: 'Too few digits for Month',
      maxlength: 'Too many digits for Month',
      min: 'Must be greater than 1',
      max: 'Range: 1-12'

    },
    dobDay: {
      required: 'Day is required',
      minlength: 'Too few digits for Day',
      maxlength: 'Too many digits for Day',
      max: 'Range: 1-31'

    },
    dobYear: {
      required: 'Year is required',
      minlength: 'Too few digits for Year',
      maxlength: 'Too many digits for Year',
      max: 'Year must be less than current year',
      min: 'Year must be greater than 1900'
    }

  }

  constructor(

    private router: Router,
    private route: ActivatedRoute,
    private q: NsqipService,
    private fb: FormBuilder,
    private r: Renderer2,
    private x: ElementRef

  ) {

    console.log('x')
  }

  ngAfterViewInit(): void {

    //this.firstField.nativeElement.focus();
    this.inputFields.first.nativeElement.focus()

  }

  setValidationMessage(cntl: string) : void {

    let c: AbstractControl = this.loginForm.get(cntl)

    this.errorMsg = "";
    this.displayMessage[cntl] = ""

 //   if ( ( c.touched || c.dirty ) && c.errors) {
      if ( c.errors) {

       var x = this.validationMessages[cntl]

       let y = Object.keys(c.errors).map( akey => {

                   let amsg =  ( typeof x[akey] == 'undefined' ) ?  'err for ' + akey : x[akey]
                   this.errorMsg += this.q.getString(amsg) + ","
                   this.displayMessage[cntl] = this.q.getString(amsg)+ ","

                })

      }

      if ( this.errorMsg.slice(-1) == ',' ) {

        this.displayMessage[cntl] = this.displayMessage[cntl].slice(0, -1)
        this.errorMsg = this.errorMsg.slice(0,-1)

      }

      this.hasErrors =  ( this.loginForm.errors == null) ? false : true

  }

  ngOnInit() {

    let x: pqs | pqError = this.route.snapshot.data["pqs"];

    let currYear: number = new Date().getFullYear()

    this.loginForm = this.fb.group({

      dobMonth: ['', [Validators.required, Validators.maxLength(2), Validators.min(1), Validators.max(12)]],
      dobDay  : ['', [Validators.required, Validators.maxLength(2),  Validators.min(1), Validators.max(31)]],
      dobYear : ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.min(1900), Validators.max(currYear)]],
      lang: 'en'
    } )

    this.loginForm.get('lang').valueChanges.subscribe( value => {

        this.chgLanguage(value)

    })

    this.loginForm.get('dobDay').valueChanges.debounceTime(400).subscribe( value => {

      this.setValidationMessage('dobDay')

      if ( this.loginForm.get('dobDay').errors == null) {

        this.dobDay = this.loginForm.get('dobDay').value

      }

    })

    this.loginForm.get('dobYear').valueChanges.debounceTime(400).subscribe( value => {

      this.setValidationMessage('dobYear')

      if ( this.loginForm.get('dobYear').errors == null) {

        this.dobYear = this.loginForm.get('dobYear').value

      }

    })

    this.loginForm.get('dobMonth').valueChanges.debounceTime(400).subscribe( value => {

        console.log(value)
        this.setValidationMessage('dobMonth')

        if ( this.loginForm.get('dobMonth').errors == null) {

          this.dobMonth = this.loginForm.get('dobMonth').value

        }

        let days: number = 31;

        switch (value) {

          case 2: days = 28; break;
          case 4:
          case 6:
          case 9:
          case 11:
            days = 30; break;
        }

        this.loginForm.get('dobDay').setValidators(Validators.max(days))


    })

    if (x instanceof pqError) {

      console.log('error from resolver ' + x.errType + "," + x.errMsg)
      this.q.language = "en"
      this.errorMsg = this.q.getString("Server error, please try later") + ": " + x.errMsg
      this.hasErrors = true;

    }
    else {

      let id   = this.route.snapshot.paramMap.get("id");
      if ( ( id == undefined) || ( id == null) ) {
        id = this.q.pathid
      }
      window.localStorage.setItem('id', id.toUpperCase())
      this.pqs = this.route.snapshot.data["pqs"];

    }

    this.setLanguage();

  }

  setLanguage(): void {

    this.dobMessage     = this.q.getString("dob");
    this.welcomeMessage = this.q.getString("Welcome");
    this.beginMsg       = this.q.getString("Before we begin please help us verify your identity."    );
    this.startMsg       = this.q.getString("Start Survey");

    if (this.hasErrors == true) {

      this.errorMsg       = this.q.getString("Server error, please try later")

    }

  }

  chgLanguage( lang: string) : void {

    if ( (this.pqs != undefined) && (this.pqs.patient != undefined)) {
      this.pqs.patient.patientLanguage = lang;

      }

      this.q.chgLanguage(lang);

      this.setLanguage()

  }

  startSurvey() {

    if ( this.loginForm.valid == false ) {

      if ( this.loginForm.touched == false) {

        this.errorMsg = "All fields are required"
      }
      else {

        Object.keys(this.loginForm.controls).forEach( (cntl: string)  => {

          let z = this.loginForm.controls[cntl]

          if ( z.errors != null) {

            this.setValidationMessage(cntl)

          }
        })


      }
        //this.loginForm.updateValueAndValidity();
     return;

    }

    if ( this.dobDay == null) {

      this.dobDay = 1;
      this.dobMonth = 1
      this.dobYear = 1980
    }

    let dob = new Date(this.pqs.patient.patientDOB).toLocaleDateString();

    let inputdob = new Date(this.dobYear, this.dobMonth - 1, this.dobDay ).toLocaleDateString();

    if (inputdob != dob) {

      this.errorMsg = this.q.getString("Incorrect birth date");

    }
    else {

      this.router.navigate(["/welcome"]);

    }
  }

  preventAlpha(evt: KeyboardEvent, cntrl, input: string) {

    let achar = +evt.key;

    if ( isNaN(achar) == true ) {

        evt.preventDefault();
        return;

    }

    let x = input.length
    let y = (<HTMLInputElement>cntrl).value
    let z = (<HTMLInputElement>cntrl).id
    let w = this.inputFields;
    let zz = w.find( (item, idx, aray): boolean => {
            let rc = ( item.nativeElement.id == 'dobMonth') ? true : false
            return rc
          });

    if ( x == 2) {

      switch (z) {

        case "dobMonth": this.r.selectRootElement('#dobDay').focus(); break;
        case "dobDay":   this.r.selectRootElement('#dobYear').focus(); break;
        case "dobYear":           break;

    }

    return;

}



}

}
