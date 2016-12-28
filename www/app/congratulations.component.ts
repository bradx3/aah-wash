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

import {Component, Inject, forwardRef} from '@angular/core';

import {GameComponent} from './game.component';
import {Player} from './player';
import {PlayerComponent} from './player.component';
import {AudioService} from './audio.service';

@Component({
  selector: 'congratulations',
  templateUrl: 'app/congratulations.component.html',
  entryComponents: [PlayerComponent]
})

export class CongratulationsComponent {
  private game: GameComponent;
  private player: Player;
  private winner: Player = null;
  private finishers: Array<Player> = [];

  constructor(@Inject(forwardRef(() => GameComponent)) game: GameComponent,
              private _audioService: AudioService) {
    this.game = game;
    this.winner = game.getWinner();
    this.finishers = game.getFinishers();
  }

  restart() {
    this.game.restart();
  }

  ngAfterViewChecked() {
    this._audioService.play("winner");
  }
}
