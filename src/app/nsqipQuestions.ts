
export class nsqipPage {

  pageNumber: number;
  pageType: string;
  pageQuestions: question[];

}

export class patientWithAnswers {

  patient: patient;
  answers: answer[];

}

export class pqs {

  patient  : patient;
  questions: question[];
  pages    : nsqipPage[];
  patientWithAnswers: patientWithAnswers;

}


export class question{

  idQuestion         : number;
  questionNo         : string;
  questionText       : string;
  questionTextSpanish: string;
  questionType       : string;
  questionNextYes    : string;
  questionNextNo     : string;
  pageNumber         : number;
  surveyType         : string;

}

export class answer {

  questionNumber: string;
  questionText  : string;
  questionType  : string;
  answer        : string;

}

export class patient {

  idPatient          : number;
  patientType        : string;
  patientMRN         : string;
  patientEMPI        : string;
  patientName        : string;
  patientDOB         : string;
  patientPhone       : string;
  patientCell        : string;
  patientEmail       : string;
  patientLanguage    : string;
  patientOptInOut    : string;
  surgeonName        : string;
  surgeryDate        : string;
  hospitalName       : string;
  dateTextSent       : string;
  dateTextClicked    : string;
  dateSurveyCompleted: string;
  hasErrors          : string;
  filteredBy         : string;
  urlForText         : string;
  shortenedUrl       : string;
  createdDate        : string;
  isProcessed        : string;

}

// export class allData {

//   questions: nsqipQuestions;
//   pages: nsqipPage[];

// }

// export class nsqipQuestions {
//   adults: question[];
//   children: question[];
// }
