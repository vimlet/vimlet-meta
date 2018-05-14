#!/usr/bin/env node

var commons = require("@vimlet/commons");
var path = require("path");
var glob = require("glob");
var fs = require("fs-extra");
var cli = require("@vimlet/cli").instantiate();
var watch = require("./lib/watch");

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
  return function () {
    var lastArgPosition = arguments.length - 1;
    var callback = arguments[lastArgPosition];
    try {
      arguments[lastArgPosition] = function (data) {
        callback(null, data);
      }
      fn.apply(null, arguments);
    } catch (error) {
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
module.exports.parseTemplateGlob = function (include, options, callback) {
  options = options || {};
  var rootsArray = commons.io.getFiles(include, options.exclude);
  rootsArray.forEach(function (rootObject) {
    rootObject.files.forEach(function (relativePath) {
        module.exports.parseTemplate(path.join(rootObject.root, relativePath), options, function (error, data) {
        callback(error, {
          relativePath: relativePath,
          result: data
        });
      });
    });
  });
};

module.exports.parseTemplateGlobAndWrite = function (include, output, options) {
  options = options || {};
  if (options.clean) {
    fs.removeSync(output);
  }
  module.exports.parseTemplateGlob(include, options, function (error, data) {
    if (error) {
      console.error(error);
    } else {
      if (data && output) {
        // Write data to output without .vmt extension
        var fileOutput = path.join(output, data.relativePath).replace(".vmt", "");
        fs.mkdirsSync(path.dirname(fileOutput));
        fs.writeFileSync(fileOutput, data.result);
      }
    }
  });
};


module.exports.watch = function (include, output, options) {
  module.exports.parseTemplateGlobAndWrite(include, output, options);
  watch.watch(include, output, options);
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
    .value("-i", "--include", "Include patterns", list)
    .value("-e", "--exclude", "Exclude patterns", list)
    .value("-o", "--output", "Output path")
    .value("-d", "--data", "Json file path")
    .flag("-c", "--clean", "Clean output directory")
    .flag("-w", "--watch", "Keeps watching for changes")
    .flag("-h", "--help", "Shows help")
    .parse(process.argv);

  var cwd = process.cwd();

  var readData = null;
  if (cli.result.data) {
    if (fs.existsSync(path.join(cwd, cli.result.data))) {
      readData = JSON.parse(fs.readFileSync(path.join(cwd, cli.result.data)));
    }
  }

  var include = cli.result.include || "**/*.vmt";
  var exclude = cli.result.exclude || "**node_modules**";
  var data = readData || {};
  var output = cli.result.output || cwd;
  var clean = cli.result.clean || false;


  var options = {};
  options.exclude = exclude;
  options.data = data;
  options.clean = clean;


  if (cli.result.help) {
    cli.printHelp();
  } else {
    if (cli.result.watch) {
      module.exports.watch(include, output, options);
    } else {
      module.exports.parseTemplateGlobAndWrite(include, output, options);
    }
  }

}