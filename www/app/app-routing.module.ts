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

import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfigGuard } from './config-guard.service';

import { ChooseLocaleComponent } from './choose-locale.component';
import { GameComponent } from './game.component';
import { PassTabletComponent } from './pass-tablet.component';
import { PlayerDetailsComponent } from './player-details.component';
import { PromptPlayerComponent } from './prompt-player.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/prompt-player',
    pathMatch: 'full'
  },
  {
    path: 'prompt-player',
    component: PromptPlayerComponent,
    canActivate: [ConfigGuard]
  },
  {
    path: 'player-details',
    component: PlayerDetailsComponent,
    canActivate: [ConfigGuard]
  },
  {
    path: 'pass-tablet',
    component: PassTabletComponent,
    canActivate: [ConfigGuard]
  },
  {
    path: 'game',
    component: GameComponent,
    canActivate: [ConfigGuard]
  },
  {
    path: 'locale',
    component: ChooseLocaleComponent,
    canActivate: [ConfigGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  exports: [
    RouterModule
  ],
  providers: [
    ConfigGuard
  ]
})
export class AppRoutingModule {}

// export const routing = RouterModule.forRoot(appRoutes, { useHash: true });
