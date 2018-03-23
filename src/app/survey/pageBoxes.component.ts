import { Component, Input, Output, AfterViewInit, OnInit, EventEmitter } from "@angular/core";
//import { FormGroup } from "@angular/forms";
import { NsqipService } from '../nsqip.service';
import { question, nsqipPage, patient, answer, patientWithAnswers } from "../nsqipQuestions";

@Component({
  selector: "pageBoxes",
  templateUrl: "./pageBoxes.component.html"
})
export class BoxesComponent implements OnInit, AfterViewInit {


  @Input() Page: nsqipPage;
  @Input() patientWithAnswers: patientWithAnswers;

  @Output() action: EventEmitter<number> = new EventEmitter<number>();

  pageNumber: number;
  pageQuestions: question[];
  questionsEnglish : question[];
  questionsSpanish : question[];
  answers: string[] = [];

  // form: FormGroup;
  // nsqipForm: FormGroup;

  // payLoad = "";

  constructor( private q: NsqipService)
  {
    console.log("box cons");
  }

  getString(msg: string): string{

    let amsg = this.q.getString(msg);

    return amsg;
  }

  ngOnInit() {

    console.log("box init");

    this.pageNumber = this.Page.pageNumber;

    this.questionsEnglish = Object.assign(this.Page.pageQuestions)
    this.questionsSpanish = Object.assign(this.Page.pageQuestions);

    this.questionsSpanish.map( (q: question) => q.questionText = q.questionTextSpanish )

    this.pageQuestions = ( this.q.language == 'es') ? this.questionsSpanish : this.questionsEnglish

  }

  ngAfterViewInit(): void {

    this.pageNumber = this.Page.pageNumber;
    this.pageQuestions = this.Page.pageQuestions;

  }

  ans(page: nsqipPage, questionAnswer: string) {

    let apatient = this.patientWithAnswers;
    let currentPage = page.pageNumber;
    let nextPage = page.pageQuestions[0].questionNextYes

    for (let i = 0; i < this.answers.length; i++) {

      let theAns: answer = new answer();

      theAns.questionNumber = page.pageQuestions[i].questionNo;
      theAns.questionText = page.pageQuestions[i].questionText;
      theAns.questionType = page.pageQuestions[i].questionType;

      theAns.answer = this.answers[i];

      apatient.answers[+theAns.questionNumber-1].answer = theAns.answer;

    }

    if ( questionAnswer == 'back') {

    }

    this.action.emit(+nextPage);

  }

  // onSubmit() {
  //   this.payLoad = JSON.stringify(this.form.value);
  // }

}
