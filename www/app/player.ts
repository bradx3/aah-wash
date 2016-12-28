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

export class Player {
  id: number = null;
  name: string = "";
  position: number = 1;
  image: string;
  nextPosition: number;
  complete: boolean = false;
  responses: Array<Object> = [];

  constructor(properties:Object) {
    this.responses = [];

    for (let prop in properties) {
      this[prop] = properties[prop];
    }
  }

  getScore() {
    var correct = 0;
    var incorrect = 0;

    for (let answer of this.responses) {
      if (answer["correct"]) {
        correct += 1;
      }
      else {
        incorrect += 1;
      }
    }
    return correct / (correct + incorrect);
  }

  trackResponse(response:Object) {
    this.responses.push(response)
  }
}
