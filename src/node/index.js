#!/usr/bin/env node

"use strict";

// Require
var meta = require("./lib/meta-base");
var commons = require("@vimlet/commons");
var metaInstance = meta.instance();

// Meta node config
metaInstance.engine = "node";

// Interpreter
this.instance = function() {
  return meta.instance();
};

// Command
var program = require("commander");
var fs = require("fs-extra");
var yaml = require("js-yaml");
var getDirName = require("path").dirname;
var path = require("path");

var cwd = process.cwd();

//@property (private) filesToWrite [Trigger to launch callback when all files are created]
var filesToWrite = 0;
//@property (private globalCallback [Current callback will be used out of the init function scope])
var globalCallback = null;

/**
 * Public function to call from module
 * @param  {[type]} template [description]
 * @param  {[type]} output   [description]
 * @param  {[type]} data     [description]
 * @return {[type]}          [description]
 */
exports.parse = function(include, exclude, output, data, clean, callback) {
  globalCallback = callback;
  clean = clean || true;
  if (clean) {
    commons.io.deleteFolderRecursive(output);
  }

  var dataFile = getDataFile(data); //TODO use commons.io

  var allTemplates = commons.io.getFiles(include, exclude);
  if (allTemplates.length > 0) {
    filesToWrite = 0;
    allTemplates.forEach(function(templates) {
      if (templates.files.length > 0) {
        templates.files.forEach(function(template) {
          filesToWrite++;
          var currentTemplate = path.join(templates.root, template);
          var currentOutput = path.join(output, template);
          currentOutput = path.join(path.dirname(currentOutput), path.basename(currentOutput, path.extname(currentOutput))); //Remove template extension
          metaInstance.parseTemplate(
            null,
            currentTemplate,
            dataFile,
            function(result) {
              writeToDisk(currentOutput, result, parseCallback);
            }
          );
        });
      }
    });
  }
};


  /*
    @function parseCallback (private) [Callback when a doc is written to disk]
     */
  function parseCallback() {
    filesToWrite--;
    if (filesToWrite <= 0) {
      if (globalCallback) {
        globalCallback();
      }
    }
  }


// Command mode
if (!module.parent) {
  program
    .version("0.0.1")
    .option("-i, --include <item, item...>", "Work folders", list)
    .option("-e, --exclude <items>", "Exclude sub folders", list)
    .option("-o, --output <item>", "Add output")
    .option("-d, --data <item, item...>", "Add data.", list)
    .option("-c, --clean", "Empty directory before generate")
    .on("--help", function() {
      console.log();
      console.log("  Examples:");
      console.log("vimlet-meta -i **/*.* -o output");
      console.log("vimlet-meta");
      console.log(
        "Both examples do the same cause the first one is default config"
      );
        console.log();
    })
    .parse(process.argv);

  var include = program.include || [
    path.join(cwd, "**/*.*"),
  ];
  var output = program.output || path.join(cwd, "output");
  var data = program.data || {};

  exports.parse(include, program.exclude, output, data, program.clean);

}



/**
 * Read data from file or return if JSON
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function getDataFile(data) {
  if (!Array.isArray(data) && typeof data === "object") {
    return data;
  } else {
    var dataFile = {};
    // If data is directory then take all json files
    var isDirectory = false;

    try {
      if (fs.lstatSync("" + data).isDirectory()) {
        isDirectory = true;
      }
    } catch (exception) {
      // Do nothing
    }
    if (isDirectory) {
      dataFile = readFolderData(data);
    } else {
      dataFile = readData(data);
    }

    return dataFile;
  }
}

function writeToDisk(output, result, callback) {
  fs.mkdirp(getDirName("" + output), function(err) {
    if (err) {
      if (callback) {
        callback(err);
      }
      return console.log(err);
    }

    fs.writeFile("" + output, result, function(err) {
      if (err) {
        if (callback) {
          callback(err);
        }
        return console.log(err);
      } else {
        if (callback) {
          callback();
        }
      }
    });
  });
}

function readData(dataPath) {
  var dataFile = {};
  for (var i = 0; i < dataPath.length; i++) {
    var currentPath = path.resolve(dataPath[i]);

    if (fs.existsSync(currentPath)) {
      var tempData;
      if (currentPath.split(".").pop() == "yml") {
        try {
          var doc = yaml.load(fs.readFileSync(currentPath, "utf8"));
          tempData = JSON.stringify(doc);
          tempData = JSON.parse(tempData);
          dataFile = merge(dataFile, tempData);
        } catch (e) {
          console.log("Can not read yml.");
        }
      } else if (currentPath.split(".").pop() == "json") {
        tempData = fs.readFileSync(currentPath, "utf8");
        tempData = JSON.parse(tempData);
        dataFile = merge(dataFile, tempData);
      }
    } else {
      console.log("\n Data " + currentPath + " not found");
    }
  }

  return dataFile;
}

function readFolderData(dataPath) {
  var files = fs.readdirSync("" + dataPath, "utf8");

  for (var fileIndex = 0; fileIndex < files.length; fileIndex++) {
    files[fileIndex] = dataPath + "/" + files[fileIndex];
  }

  return readData(files);
}

function merge(obj, src) {
  Object.keys(src).forEach(function(key) {
    obj[key] = src[key];
  });

  return obj;
}

function list(val) {
  return val.split(",");
}
