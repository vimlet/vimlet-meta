var path = require("path");
var commons = require("../../../../src/node/node_modules/@vimlet/commons");


// Vimlet meta command
var command = "node index.js";
var include = path.join(__dirname, "../../source/manualTest/simpleTemplate.js.vim");
var output = path.join(__dirname, "../../output");
var data = path.join(__dirname, "../../source/manualTest/data.json");

var params = '-o ' + output + ' -i ' + include + ' -d ' + data + ' -c';
command = command + " " + params;
params = null;
var workingDirectory = path.resolve("../../../../src/node");

// Run test
  commons.run.exec(command, params, workingDirectory, null, function() {
    console.log("Done");
  });
