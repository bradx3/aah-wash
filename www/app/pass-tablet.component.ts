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

import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {Player} from './player';
import {PlayerComponent} from './player.component';
import {ConfigService} from './config.service';
import {PlayersService} from './players.service';
import {PlayerListComponent} from './player-list.component';

@Component({
  selector: 'pass-tablet',
  templateUrl: 'app/pass-tablet.component.html',
  entryComponents: [PlayerComponent, PlayerListComponent]
})

export class PassTabletComponent {
  public players: Player[];

  constructor(
    private _playersService: PlayersService,
    private _configService: ConfigService,
    private _router: Router) {
    this.players = _playersService.getPlayers();;

    if (this.players.length == 0) {
      _playersService.mockPlayers(2, true);
      this.players = _playersService.getPlayers();
    }
  }

  moveToNext() {
    this._router.navigate(['prompt-player']);
  }
}
