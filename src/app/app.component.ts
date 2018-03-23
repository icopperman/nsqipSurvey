import { Component, OnInit } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { NsqipService } from './nsqip.service';
//import { nsqipQuestions, question, nsqipPage } from './nsqipQuestions';
import { Router, ActivatedRoute } from '@angular/router/';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  // questions: any[];
  // nsQuestions: nsqipQuestions;
  // adultQuestions: question[];
  // adultPages: nsqipPage[];

  constructor(private q: NsqipService,   private location: Location, r: Router, a: ActivatedRoute  )
   {

      let path = this.location.path();

      q.pathid = path.split('=')[1];

  }

  ngOnInit(): void {  }

}

// if ( path == undefined || path == "") {
    //   //path = "a";
    //   //throw error
    // }
    // else {
    //   if (path.indexOf('?') != -1 ) {
    //     path = path.split('=')[1]
    //   }
    //   else {
    //     path = 'a'
    //   }
    // }

    //this.getQuestions();

    //this.getPages();

    //router.navigate(['/login', path])
