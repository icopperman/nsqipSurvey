import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ParamMap } from "@angular/router/src/shared";

import "rxjs/add/operator/switchMap";

import { NsqipService } from "../nsqip.service";
import { pqs } from "../nsqipQuestions";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {

  dobMonth: number;
  dobDay  : number;
  dobYear : number;

  //adultMessage: string; // = this.getString("Please enter your Date of Birth")
  //childMessage: string; // = this.getString("Please enter the patient's Date of Birth")
  welcomeMessage: string;
  beginMsg      : string;
  startMsg      : string;
  message       : string;
  errorMsg      : string;

  pqs           : pqs;
  lang          : string;
  //aorc: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private q: NsqipService
  ) {}

  ngOnInit() {

    let id   = this.route.snapshot.paramMap.get("id");
    window.localStorage.setItem('id', id.toUpperCase())

    this.pqs = this.route.snapshot.data["pqs"];
    this.setLanguage();


  }

  setLanguage(): void {

    // this.lang = this.pqs.patient.patientLanguage;

    // if (this.lang == null) {

    //   console.log('login: lang is null')
    //   this.lang = "en";

    // }

    this.message        = this.q.getString("dob");
    this.welcomeMessage = this.q.getString("Welcome");
    this.beginMsg       = this.q.getString("Before we begin please help us verify your identity."    );
    this.startMsg       = this.q.getString("Start Survey");

  }



  chgLanguage( lang: string) : void {

      this.pqs.patient.patientLanguage = lang;
      this.q.chgLanguage(lang);

      this.setLanguage()

  }

  startSurvey() {

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

}
 // getString(msg: string): string {

  //   let amsg = this.q.getString(msg);
  //   return amsg;

  // }
