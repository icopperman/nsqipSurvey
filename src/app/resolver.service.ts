import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { NsqipService} from './nsqip.service';
import { question, nsqipPage, patient, pqs } from './nsqipQuestions';

@Injectable()
export class nsqipResolveQuestions implements Resolve<pqs> {

  constructor(private q: NsqipService) {}

  resolve(route: ActivatedRouteSnapshot) {

    console.log('resolve: getquestions')

    let id: string = route.params.id;

    return this.q.getQuestions(id.toUpperCase());

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



