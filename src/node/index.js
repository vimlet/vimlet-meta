#!/usr/bin/env node

var commons = require("@vimlet/commons");
var path = require("path");
var glob = require("glob");
var fs = require("fs-extra");

// Make base accessible from the required scope
module.exports = require("./lib/meta-base").instance();

// Switch to node engine mode
module.exports.engine = "node";

// Function overloading and node standard(error, data) callbacks 
var baseParse = module.exports.parse;
var baseParseTemplate = module.exports.parseTemplate;

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

// Command mode
if (!module.parent) {
  // TODO
}