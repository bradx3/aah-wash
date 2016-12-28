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

import {Component, Inject, forwardRef, ApplicationRef} from '@angular/core';

import {Answer} from './answer';
import {GameComponent} from './game.component';
import {Player} from './player';
import {PlayerComponent} from './player.component';
import {Question} from './question';
import {AudioService} from './audio.service';

@Component({
  selector: 'question',
  templateUrl: 'app/question.component.html',
  entryComponents: [PlayerComponent]
})

export class QuestionComponent {
  private game: GameComponent;
  private player: Player;
  private question: Question;
  private answers: Array<Answer>;
  private marked: boolean;
  private result: boolean;
  private stage: number;
  private selected: Object;
  private redirects: Object;
  private onLastSquare: boolean;

  constructor(
        private _ref: ApplicationRef,
        @Inject(forwardRef(() => GameComponent)) game: GameComponent,
        private _audioService: AudioService) {
    let config = game.getConfig();

    this.game = game;
    this.player = game.getCurrentPlayer();
    console.log(this.player);

    var questionsStore = config.getQuestions();
    questionsStore.subscribe(questions => this._initQuestion(questions));

    this.redirects = config.getRedirectsForPosition(this.player.position);
    this.stage = 2;
    this.selected = {};
    this.marked = false;
  }

  continueGame() {
    var result = this.getResult();
    if (result == "correct" && this.onLastSquare) {
      this.player.complete = true;
    }

    this.player.trackResponse({ correct: (result == "correct"), time: new Date() });
    this._continueGame(result);
  }

  moveToQuestion() {
    this.stage = 2;
  }

  toggle(answer:any) {
    if (this.marked) {
      this.checkAnswers();
    }
    else {
      this.selected[answer] = !this.selected[answer];
    }
    this._ref.tick();
  }

  isSelected(answer:any) {
    return this.selected[answer];
  }

  playAudio() {
    let path:string;
    if (!this.marked) {
      path = this.question.text_audio;
    }
    else if (this.result) {
      path = this.question.correct_text_audio;
    }
    else {
      path = this.question.incorrect_text_audio;
    }
    this._audioService.playWithPath(path);
  }

  canCheckAnswers() {
    for (let key in this.selected) {
      if (this.selected[key]) {
        return true;
      }
    }
    return false;
  }

  checkAnswers() {
    this.marked = true;
    for (var answer of this.answers) {
      var correct = (answer.correct && this.isSelected(answer.text));
      answer.mark = correct ? "correct" : "incorrect";
    }
    this.result = this.getResult() == "correct";
    this._audioService.play(this.getResult());
    this._ref.tick();
  }

  getResult() {
    for (var answer of this.answers) {
      var selected = this.isSelected(answer.text);
      if ((answer.correct && !selected) || (!answer.correct && selected)) {
        console.log("Returning incorrect");
        return "incorrect";
      }

    }
    console.log("Returning correct");
    return "correct";
  }

  _continueGame(result: string) {
    var redirect = this.redirects[result];
    if (redirect) {
      this.game.handlePlayerRedirect(redirect);
    }
    else {
      this.game.moveToNextPlayer();
      this.game.moveToNextStage();
    }
  }

  // -> Fisher–Yates shuffle algorithm
  _shuffleArray(array:any) {
    let m = array.length;
    let t: any;
    let i: any;

    // While there remain elements to shuffle
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }

  _initQuestion(questions: Array<Question>) {
    console.log("_initQuestion");
    if (questions.length == 0) {
      return;
    }
    
    var requestedQuestion = document.location.hash.match("q=(q\\d+)");
    if (requestedQuestion) {
      // for debugging
      this.question = questions.find(function(e) { return e.id == requestedQuestion[1]; });
    }
    else {
      this.question = this._shuffleArray(questions)[0];
    }
    this.answers = this._shuffleArray(this.question["answers"]);
    this.onLastSquare = (this.player.position == this.game.getConfig().getNumberOfSquares());
  }
}
