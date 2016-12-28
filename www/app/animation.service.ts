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

import {Injectable} from '@angular/core';

import {Player} from './player';

import {GameComponent} from './game.component';

@Injectable()
export class AnimationService {
  animateRedirect(game:GameComponent, player:Player) {
    var startSquare = player.position;
    var endSquare = player.nextPosition;
    var playerElement = document.getElementById("player-" + player.id);

    var startRect = this._getBoundingClientRectForSquare(startSquare);
    var endRect = this._getBoundingClientRectForSquare(endSquare);
    
    console.log(playerElement == null);
    if (!startRect || !endRect) {
      console.log("exiting");
      return;
    }

    var deltaY = endRect.top - startRect.top;
    var deltaX = endRect.left - startRect.left;

    var playerElement = document.getElementById("player-" + player.id);
    var duration = Math.abs(Math.ceil((endSquare - startSquare) / 3)) + "s";
    playerElement.style["transition"] =  duration + " linear";
    playerElement.style["transform"] = "translate(" + deltaX + "px, " + deltaY + "px)";
    playerElement.style["transform-origin"] = "left";
    playerElement.style["z-index"] = "1000";

    var _this = this;
    playerElement.addEventListener("transitionend", function(e) {
      _this._completeAnimation(game, player, playerElement);
    });
  }

  animateProgress(game:GameComponent, player:Player) {
    // TODO animate around corners
    this.animateRedirect(game, player);

    /*
      WIP
    var queue = new Array<any>();
    for (var i = startSquare; i < endSquare; i++) {
      queue.push({});
    }

    var first = queue.shift();
    this._runAnimation(first, function() {
      if (queue.length > 0) {
        this._runAnimation(queue.shift())
      }
      else {
        _this._completeAnimation(game, player, playerElement);
      }
    });
    */
  }

  _getBoundingClientRectForSquare(index:Number) {
    var element = document.getElementById("square-" + index);
    if (element) {
      return element.getBoundingClientRect();
    }
  }

  _completeAnimation(game:GameComponent, player:Player, playerElement:Element) {
    if (player.nextPosition) {
      player.position = player.nextPosition;
      player.nextPosition = null;
      setTimeout(function() {
        playerElement["style"]["transform"] = "none";
        playerElement["style"]["z-index"] = null;
        if (game.isRedirecting()) {
          console.log("Finished redirecting, going to next player");
          game.moveToNextPlayer();
          game.moveToNextStage();
        }
        else {
          console.log("Not redirecting, so showing question");
          game.moveToNextStage();
        }
      }, 1000);
    }
  }

  _runAnimation(object:any, callback:Function) {
    // WIP
    debugger

    //playerElement.addEventListener("transitionend", callback);
    // todo
  }
}

