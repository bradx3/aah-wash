// Copyright 2016 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {BehaviorSubject} from "rxjs/Rx";

import {Redirect} from './redirect';
import {Question} from './question';

@Injectable()
export class ConfigService {
  private _isLoaded: BehaviorSubject<boolean>;
  private _i18n: BehaviorSubject<Object>;
  private _questions: BehaviorSubject<Array<Question>>;

  private _numberOfSquares: number;
  private _redirects: Array<Redirect>;
  private _locales: Array<string>;

  i18n(key:string, type?: string) {
    if (!type) { type = "text"; }
    if (this._i18n && this._i18n.getValue() && this._i18n.getValue()[key]) {
      return this._i18n.getValue()[key][type];
    }
  }
  
  getRedirects() {
    return this._redirects || [];
  }

  getRedirectsForPosition(position:Number) {
    var redirects = this.getRedirects();
    var result = {};

    for (var i = 0; i < redirects.length; i++) {
      var redirect = redirects[i];
      if (redirect.start == position) {
        if (redirect.type == "snake") {
          result["incorrect"] = redirect.end;
        }
        else {
          result["correct"] = redirect.end;
        }
      }
    }

    return result;
  }

  getNumberOfSquares() {
    return 19;
  }

  getQuestions() {
    return this._questions;
  }

  getAvailableLocales() {
    return this._locales;
  }

  getLocale() {
    return window.localStorage.getItem("wash.locale") || "cambodia";
  }

  isLoaded() {
    return this._isLoaded;
  }

  constructor(private _http: Http) {
    console.log("Building config service");
    this._i18n = new BehaviorSubject({});
    this._questions = new BehaviorSubject([]);
    this._isLoaded = new BehaviorSubject(false);

    _http.get("config/common.json")
      .subscribe(response => this._loadCommonConfig(response.json()));
  }

  _loadCommonConfig(config:Object) {
    this._numberOfSquares = config['numberOfSquares'];
    this._redirects = config['redirects'];
    this._locales = config['locales']
    this._http.get("config/" + this.getLocale() + ".json")
      .subscribe(response => this._setConfigData(response.json()));
  }

  _setConfigData(data:any) {
    this._questions.next(data.questions);
    this._i18n.next(data.i18n);
    this._isLoaded.next(true);
  }
}

