import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NsqipService} from './nsqip.service';
import { question, nsqipPage, patient, pqs, pqError } from './nsqipQuestions';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators/catchError';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class nsqipResolveQuestions implements Resolve<pqs | pqError> {

  constructor(private q: NsqipService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<pqs | pqError> {

    console.log('resolve: getquestions')

    let id: string = route.params.id;

    if ( ( id == undefined) || ( id == null) || (id == "") ) {

      if ( this.q.pathid == null )  {

        let x= new pqError();
        x.errType = "missing parm"
        x.errMsg = "no id presetnt"
        //x.httpError = new HttpErrorResponse({})

        return of(x)
      }
      else {

        id = this.q.pathid

      }

    }

    return this.q.getQuestions(id.toUpperCase())
              .pipe(
                catchError(err => of(err))
              )

  }

}

// @Injectable()
// export class nsqipResolvePages implements Resolve<nsqipPage[]> {

//   constructor(private q: NsqipService) {}

//   resolve(route: ActivatedRouteSnapshot) {

//     console.log('resolve: getpages')
//     return this.q.getPages();

//   }
// }

// @Injectable()
// export class nsqipResolvePatient implements Resolve<patient> {

//   constructor(private q: NsqipService) {}

//   resolve(route: ActivatedRouteSnapshot) {
//     console.log('here')
//     let id = route.params.id;

//     return this.q.getPatient(id);
//   }
// }



