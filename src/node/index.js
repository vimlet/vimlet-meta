#!/usr/bin/env node

var commons = require("@vimlet/commons");
var path = require("path");
var glob = require("glob");
var fs = require("fs-extra");
var cli = require("@vimlet/cli").instantiate();

// Make base accessible from the required scope
module.exports = require("./lib/meta-base").instance();

// Switch to node engine mode
module.exports.engine = "node";

// Function overloading and node standard(error, data) callbacks 
var baseParse = module.exports.parse;
var baseParseTemplate = module.exports.parseTemplate;

// Import watch option
var watch = require("./lib/watch");


// Converts any callback to a standard(error, data) callback
// NOTE: Only single param callback is supported
// NOTE: Callback must be the last param
function convertToNodeCallback(fn) {
  return function() {
    var lastArgPosition = arguments.length -1;    
    var callback = arguments[lastArgPosition];
    try {
      arguments[lastArgPosition] = function(data) {
        callback(null, data);
      }
      fn.apply(null, arguments);  
    }catch(error) {
      callback(error);
    }
  };
}

module.exports.parse = function () {
    convertToNodeCallback(baseParse).apply(null, arguments);
};

module.exports.parseTemplate = function () {
    convertToNodeCallback(baseParseTemplate).apply(null, arguments);
};

// Node engine specific functions
module.exports.parseTemplateGlob = function(scope, include, exclude, data, callback) {
  var rootsArray = commons.io.getFiles(include, exclude);
  rootsArray.forEach(function(rootObject){
    rootObject.files.forEach(function(relativePath){
      module.exports.parseTemplate(scope, path.join(rootObject.root, relativePath), data, function(error, data) {
        callback(error, {
            relativePath: relativePath,
            result: data
        });
      });
    }); 
  });
};

module.exports.parseTemplateGlobAndWrite = function(scope, include, exclude, data, output, clean) {
  if (clean) {
    fs.removeSync(output);
  }
  module.exports.parseTemplateGlob(scope, include, exclude, data, function(error, data){
      if(error) {
        console.error(error);
      } else {
        if(data && output) {
          // Write data to output without .vmt extension
          var fileOutput = path.join(output, data.relativePath).replace(".vmt", "");
          fs.mkdirsSync(path.dirname(fileOutput));  
          fs.writeFileSync(fileOutput, data.result);
        }
      }
  });
};


module.exports.watch = function(scope, include, exclude, data, output, clean) {
  module.exports.parseTemplateGlobAndWrite(scope, include, exclude, data, output, clean);
  watch.watch(include,exclude,data,output);
};


// Command mode
if (!module.parent) {

  function list(value) {
    var result = value.split(",");
    for (var i = 0; i < result.length; i++) {
      result[i] = result[i].trim();
    }
    return result;
  }

  cli
    .value("-i", "--include", "", list)
    .value("-e", "--exclude", "", list)
    .value("-o", "--output", "")
    .value("-d", "--data", "", list)
    .value("-c", "--clean", "")
    .flag("-w", "--watch", "")
    .parse(process.argv);

  // cli.printHelp();

  var cwd = process.cwd();
  var include = cli.result.include || "**/*.vmt";
  var exclude = cli.result.exclude || "**node_modules**";
  var data = cli.result.data || {};
  var output = cli.result.output || cwd;
  var clean = cli.result.clean || false;

  if (cli.result.watch) {
    module.exports.watch(null, include, exclude, data, output, clean);
  } else {
    module.exports.parseTemplateGlobAndWrite(null, include, exclude, data, output, clean);
  }

}