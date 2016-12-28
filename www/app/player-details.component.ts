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

@Component({
  selector: 'player-details',
  templateUrl: 'app/player-details.component.html',
  entryComponents: [PlayerComponent]
})

export class PlayerDetailsComponent {
  public player: Player;
  public name: String;

  constructor(
    private _configService: ConfigService,
    private _playersService: PlayersService,
    private _router: Router) {
    let players  = _playersService.getPlayers();
    
    if (players.length == 0) {
      _playersService.mockPlayers(1, false);
      _playersService.getPlayers();
    }

    this.player = players[players.length - 1];
  }

  savePlayer() {
    this._router.navigate(['/pass-tablet', {}]);
  }

  handleNameKeypress(event:KeyboardEvent) {
    if (event.charCode == 13) {
      this.savePlayer();
    }
  }
}
