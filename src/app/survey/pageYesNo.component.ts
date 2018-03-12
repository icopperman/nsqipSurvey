import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { NsqipService } from "../nsqip.service";
import {

  question,
  nsqipPage,
  patient,
  answer,
  patientWithAnswers
} from "../nsqipQuestions";

@Component({
  selector: "pageYesNo",
  templateUrl: "./pageYesNo.component.html"
})
export class YesNoComponent implements OnInit {
  @Input() Page: nsqipPage;
  @Input() patientWithAnswers: patientWithAnswers;
  @Output() action = new EventEmitter<number>();

  pageNumber: number;
  pageQuestions: question[];

  //form: FormGroup;
  //nsqipForm: FormGroup;
  //payLoad = "";

  constructor(private q: NsqipService) {}

  getString(msg: string): string {

    let amsg = this.q.getString(msg);

    return amsg;
  }

  ans(page: question, questionAnswer: string) {

    let currentPage = page.pageNumber;
    let apatient = this.patientWithAnswers;

    let theAns: answer = new answer();

    theAns.questionNumber = page.questionNo;
    theAns.questionText = page.questionText;
    theAns.questionType = page.questionType;
    theAns.answer = questionAnswer;

    apatient.answers[+theAns.questionNumber - 1].answer = questionAnswer;

    if (questionAnswer == "back") {

      this.action.emit(-1);

    }
    else {

      let nextPage = questionAnswer == "yes" ? page.questionNextYes : page.questionNextNo;

      this.action.emit(+nextPage);

    }
  }

  ngOnInit() {

    console.log("yesno init");

    this.pageNumber = this.Page.pageNumber;
    this.pageQuestions = this.Page.pageQuestions;

  }

  // onSubmit() {
  //   this.payLoad = JSON.stringify(this.form.value);
  // }

}
