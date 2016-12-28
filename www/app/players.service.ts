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

import { Injectable } from '@angular/core';

import { Player } from './player';

@Injectable()
export class PlayersService {
  players: Player[] = [];

  getPlayers() { return this.players; }

  savePlayer(player:Player) {
    this.players.push(player);
  }

  resetPlayers() {
    this.players = [];
  }

  addNewPlayer() {
    this.mockPlayers(1, false);
  }

  mockPlayers(count:Number, includeNames:Boolean) {
    for (var i = 0; i < count; i++) {
      let id = (this.players.length + 1);
      let player = new Player({
        id: id,
        position: 1, 
        image: 'img/defaults/p' + id + '.png'
      });

      if (includeNames) {
        let names = ['Brad', 'Katie', 'Mark', 'Mattheus', 'Nicolas'];
        player.name = names[id - 1];
      }

      this.players.push(player);
    }
  }

  constructor() {
    console.log("Building players service");
  }
}
