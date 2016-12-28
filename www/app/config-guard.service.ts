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

import { Injectable }       from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild
}                           from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from './config.service';

@Injectable()
export class ConfigGuard implements CanActivate {
  constructor(private _router: Router,
              private _configService: ConfigService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (this._configService.isLoaded().value || Object.keys(route.queryParams).length > 0) {
      return Observable.of(true);
    }
    else {
      console.log("Waiting for config to load");
      this._configService.isLoaded().subscribe((loaded) => {
        if (loaded) {
          this._router.navigate([route.url[0].path]);
        }
      });
      return Observable.of(false);
    }
  }
}

