#!/usr/bin/env node

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

var request = require("request");
const fs = require("fs");

const locale = process.argv[2];
const url = process.argv[3];
const basePath = "www/assets/" + locale;
if (!fs.existsSync(basePath)) {
  fs.mkdir(basePath);
}


request(url, (error, response, body) => {
  processCSV(body);
});

function processCSV(body) {
  var res = {};

  var parts = body.split("\nQuestions\t");
  res["i18n"] = processI18n(parts[0]);
  res["questions"] = processQuestions(parts[1]);

  fs.writeFile("www/config/" + locale + ".json", JSON.stringify(res, null, 2));
}

function processI18n(parts) {
  var res = {};

  parts.trim().split("\n").slice(1).forEach((line) => {
    var words = line.split("\t");
    res[words[0]] = {
      "text": words[1],
      "audio": download(words[2], basePath + "/i18n_" + words[0] + ".mp3")
    }
  });

  return res;
}

function processQuestions(questions) {
  var res = [];

  var lines = questions.trim().split("\n");
  lines.shift();
  var headers = lines.shift().split("\t");

  lines.forEach((line) => {
    var values = line.split("\t");
    var path = basePath + "/" + values[0];
    var hash = {
      "id": values[0],
      "text": values[1],
      "text_audio": download(values[2], path + "_text.mp3"),
      "correct_text": values[3],
      "correct_text_audio": download(values[4], path + "_correct_text.mp3"),
      "incorrect_text": values[5],
      "incorrect_text_audio": download(values[6], path + "_incorrect_text.mp3")
    };

    hash["answers"] = [];
    var offset = 7;
    for (var i = 0; i < 16; i+=4) {
      var text = values[offset + i];
      var index = (i / 4) + 1;
      if (text) {
        hash["answers"].push({
          "text": text,
          "image": download(values[offset + i + 1], path + "_answer" + index + ".png"),
          "audio": download(values[offset + i + 2], path + "_answer" + index + ".mp3"),
          "correct": values[offset + i + 3] == "TRUE"
        });
      }
    }

    hash["images"] = [];
    for (var i = 23; i < headers.length; i+=2) {
      var name = values[i];
      var url = download(values[i + 1], path + "_image_" + name + ".png");
      if (name) {
        hash["images"].push({ "name": name, "path": url });
      }
    }
    res.push(hash);
  });

  return res;
}

function download(url, path) {
  var settings = {
    method: "GET",
    url: url,
    encoding: null
  }

  request(settings, (error, response, body) => {
    fs.writeFile(path, body);
  });

  return path.replace(/^www\//, "");
}
