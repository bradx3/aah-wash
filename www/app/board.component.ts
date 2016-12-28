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

import {Component, Input, Inject, forwardRef, ElementRef} from '@angular/core';

import {Player} from './player';
import {Square} from './square';

import {PlayerListComponent} from './player-list.component';
import {GameComponent} from './game.component';

import {AnimationService} from './animation.service';
import {ConfigService} from './config.service';
import {DiceService} from './dice.service';

@Component({
  selector: 'board',
  templateUrl: 'app/board.component.html',
  entryComponents: [PlayerListComponent]
})

export class BoardComponent {
  private game: GameComponent;
  private player: Player;
  private players: Player[];

  private squares: Array<Square> = [];
  private roll: number;
  private redirects: Array<Object>;

  constructor(
    @Inject(forwardRef(() => GameComponent)) game: GameComponent,
    private _element: ElementRef,
    private _animationService: AnimationService,
    private _diceService: DiceService) {

    this.game = game;
    this.player = game.getCurrentPlayer();
    this.players = game.getPlayers();

    let config = game.getConfig();
    this._initSquares(config.getNumberOfSquares());
    this.redirects = config.getRedirects();
  }

  showQuestion() {
    this.game.moveToNextStage();
  }

  shouldAnimateRoll() {
    return !this.game.isRedirecting();
  }

  movePlayerForward(count: number) {
    this.game.movePlayerToPosition(this.player.position + count);
    this._animationService.animateProgress(this.game, this.player);
  }

  restartGame() {
    this.game.restart();
  }

  // private helper functions

  _initSquares(count:number) {
    for (var i = 0; i < count; i++) {
      let s = new Square();
      s.label = (i + 1).toString();
      s.position = (i + 1);
      s.players = [];
      this.squares.push(s);
    }
  }

  ngAfterViewChecked() {
    if (this.game.isRedirecting()) {
      this._animationService.animateRedirect(this.game, this.player);
    }
  }
}
