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

import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Player } from './player';
import { ConfigService } from './config.service';
import { PlayersService } from './players.service';

@Component({
  selector: 'prompt-player',

  templateUrl: 'app/prompt-player.component.html'
})

export class PromptPlayerComponent {
  public players: Player[];
  private localeTrigger: number;

  constructor(
    private _playersService: PlayersService,
    private _configService: ConfigService,
    private _router: Router) {
    
    this.players = _playersService.getPlayers();
    this.localeTrigger = 0;
  }

  takePhoto() {
    if (navigator["camera"]) {
      let camera = navigator["camera"];
      camera.getPicture(this._savePhoto.bind(this), null,
                        { destinationType: camera.DestinationType.FILE_URI });
    }
    else {
      this._playersService.addNewPlayer();
      this._router.navigate(['/player-details', {}]);
    }
  }

  startGame() {
    this._router.navigate(['/game']);
  }

  chooseLocale() {
    this.localeTrigger += 1;
    if (this.localeTrigger >=5 ) {
      this._router.navigate(['/locale']);
    }
  }

  _getId() {
    return this.players.length + 1;
  }

  _savePhoto(imageURI:string) {
    this._playersService.addNewPlayer();
    let player = this.players[this.players.length - 1];
    player.image = imageURI;
    this._router.navigate(['/player-details', {}]);
  }
}
