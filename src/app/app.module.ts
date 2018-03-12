import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Routes } from "@angular/router";

import { AppComponent } from "./app.component";

import { LoginComponent } from "./login/login.component";
import { WelcomeComponent } from "./welcome/welcome.component";
import { SurveyComponent } from "./survey/survey.component";
import { YesNoComponent } from "./survey/pageYesNo.component";
import { BoxesComponent } from "./survey/pageBoxes.component";
import { ConfirmComponent } from "./confirm/confirm.component";

import { nsqipResolveQuestions } from "./resolver.service";
import { NsqipService } from "./nsqip.service";
import { httpInterceptorProviders } from "./interceptorsBarrel";

const appRoutes: Routes = [

  { path: "confirm", component: ConfirmComponent },
  { path: "welcome", component: WelcomeComponent },
  { path: "survey",  component: SurveyComponent  },
  { path: "login/:id",  component: LoginComponent,
    resolve: { pqs: nsqipResolveQuestions  },
    data: { title: "Login" }
  },
  { path: ":id",  redirectTo: "/login/:id",    pathMatch: "full"  }
//,{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes //,      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [
    httpInterceptorProviders,
    nsqipResolveQuestions,
    NsqipService
    //  , nsqipResolvePatient
  ],
  declarations: [
    AppComponent,
    YesNoComponent,
    BoxesComponent,
    SurveyComponent,
    LoginComponent,
    WelcomeComponent,
    ConfirmComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {}
}
