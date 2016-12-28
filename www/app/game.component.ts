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

import { Component, ApplicationRef } from '@angular/core';
import { Router } from '@angular/router';

import { Player } from './player';
import { ConfigService } from './config.service';
import { PlayersService } from './players.service';
import { PromptComponent } from './prompt.component';
import { RollComponent } from './roll.component';
import { BoardComponent } from './board.component';
import { QuestionComponent } from './question.component';
import { CongratulationsComponent } from './congratulations.component';

@Component({
  selector: 'game',
  template: `
    <prompt *ngIf="stage == 'prompt'"></prompt>
    
    <board *ngIf="stage == 'board'"></board>

    <question *ngIf="stage == 'question'"></question>

    <congratulations *ngIf="stage == 'congratulations'"></congratulations>
  `,

  providers: [ConfigService]
})

export class GameComponent {
  public players: Player[];
  private redirecting: boolean = false;
  private stage: string;
  private index: number;

  constructor(
    private _ref: ApplicationRef,
    private _router: Router,
    private _configService: ConfigService,
    private _playersService: PlayersService) {

    this.players = _playersService.getPlayers();

    if (this.players.length == 0) {
      // debugging code
      _playersService.mockPlayers(5, true);
      this.setStage('question');
    }
    else {
      this.setStage('prompt');
    }

    this.index = 0;
  }

  getConfig() {
    return this._configService;
  }

  getCurrentPlayer() {
    return this.players[this.index];
  }

  getPlayers() {
    return this.players;
  }

  handlePlayerRedirect(endPosition: number) {
    this.movePlayerToPosition(endPosition);
    this.setIsRedirecting(true);
    this.setStage('board');
  }

  isRedirecting() {
    return this.redirecting;
  }

  setIsRedirecting(redirecting: boolean) {
    this.redirecting = redirecting;
  }

  moveToCongratulations() {
    this.setStage('congratulations');
  }

  moveToNextStage() {
    var playersRemaining = 0;
    for (let player of this.players) {
      if (!player.complete) {
        playersRemaining += 1;
      }
    }

    if (playersRemaining > 1) {
      if (this.isRedirecting()) {
        this.setIsRedirecting(false);
        this.setStage('prompt');
      }
      else {
        let stages = ['prompt', 'board', 'question'];
        let nextIndex = (stages.indexOf(this.stage) + 1) % stages.length;
        this.setStage(stages[nextIndex]);
      }
    }
    else {
      this.moveToCongratulations();
    }
  }

  moveToNextPlayer() {
    for (var i = 0; i < this.players.length; i++) {
      var index = (this.index + i + 1) % this.players.length;
      if (!this.players[index].complete) {
        this.index = index;
        return;
      }
    }
  }

  movePlayerToPosition(position: number) {
    let player = this.getCurrentPlayer();
    let squares = this.getConfig().getNumberOfSquares();
    if (position > squares) {
      position = squares;
    }
    player.nextPosition = position;
  }

  afterAnimatePlayerMove() {
    
  }

  getWinner() {
    var max = 0;
    var winner = this.players[0];

    for (var i = 1; i < this.players.length; i++) {
      var score = this.players[i].getScore();
      if (score > max) {
        max = score;
        winner = this.players[i];
      }
    }
    return winner;
  }

  getFinishers() {
    return this.players.sort(function(a, b) {
      return b.getScore() - a.getScore();
    });
  }

  restart() {
    this._playersService.resetPlayers();
    this._router.navigate(['/']);
  }

  setStage(stage:string) {
    this.stage = stage;
    this._ref.tick();
  }
}
