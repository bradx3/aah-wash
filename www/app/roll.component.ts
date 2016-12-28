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

import {Component, Inject, forwardRef, ElementRef} from '@angular/core';

import {BoardComponent} from './board.component';
import {Player} from './player';
import {PlayerComponent} from './player.component';
import {DiceService} from './dice.service';

@Component({
  selector: 'roll',
  templateUrl: 'app/roll.component.html',
  entryComponents: [PlayerComponent]
})

export class RollComponent {
  private board: BoardComponent;
  private player: Player;
  private roll: number;

  private animateCount: number;
  private maxAnimations: number = 10;
  private timer: number;
  private restartTrigger: number = 0;

  constructor(
    @Inject(forwardRef(() => BoardComponent)) board: BoardComponent,
    private element: ElementRef,
    private _diceService: DiceService) {

    this.board = board;
    this.restartTrigger = 0;

    if (this.board.shouldAnimateRoll()) {
      this.roll = this._diceService.roll();
      this.animateCount = 0;
      this.timer = setInterval(this.animate.bind(this), 400);
    }
    else {
      this.roll = this._diceService.getLastRoll();
    }
  }

  animate() {
    let roll = this.roll;
    let className = "";

    if (this.animateCount < this.maxAnimations) {
      className += " animating";
      roll = (this.animateCount % 6) + 1;
      this.animateCount += 1;
    }
    else {
      clearInterval(this.timer);
      this.timer = null;
      this.board.movePlayerForward(this.roll);
    }

    this._setDiceClass(className + " roll-" + roll);
  }

  handleClick(event:any) {
    // hidden event to trigger a restart - 2x double tap on dice
    this.restartTrigger += 1;
    if (this.restartTrigger > 5) {
      this.board.restartGame();
    }
  }

  _setDiceClass(className:String) {
    let diceElement = this.element.nativeElement.getElementsByClassName("dice")[0];
    diceElement.className = "dice " + className;
  }
}
