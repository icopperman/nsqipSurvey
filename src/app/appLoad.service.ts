import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NsqipService } from './nsqip.service';

@Injectable()
export class AppLoadSvc {

  constructor(private http: HttpClient, private q: NsqipService) {}

  getURL() {

    let path = 'assets/url.json' //really a json file, but iis will not serve json files

    let promise = this.http.get(path)
                  .toPromise()
                  .then(settings => {
                    this.q.url = settings['url'];
                    this.q.langDictionary = settings["langDictionary"]
                    console.log('here')
                    return settings
                  })
                  .catch( (err) => {
                    this.http.get('assets/url.txt')
                        .toPromise()
                        .then(settings => {
                          this.q.url = settings['url'];
                          this.q.langDictionary = settings["langDictionary"]

                          console.log('here')
                          return settings
                        })
                        .catch( (err) => {
                          console.log('cant find assets/url')

                        })

                  })

    return promise

  }
}
