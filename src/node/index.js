#!/usr/bin/env node

"use strict";

// Require
var meta = require("./lib/meta-base");
var commons = require("@vimlet/commons");
var metaInstance = meta.instance();
// @property lib (public) [Access to library]
exports.lib = meta;

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


//@property defaultExclude {string[]} [node_modules folders are excluded by default if the user doesn't specify any exclude at all]
var defaultExclude = ["**/node_modules/**"];

/*
@function parseTemplateWrite (public) [Parse all templates in include and write them to disk]
@param include {[string]} [Included template patterns]
@param exclude {[string]} [Excluded template patterns]
@param output {string} [Output folder]
@param data {[string]} [Data object, folder or array of folders to search for data]
@param clean {boolean} [Empty ouput folder before parse]
@param callback
 */
exports.parseTemplateWrite = function(scope, include, exclude, output, data, clean, callback) {
  globalCallback = callback;
  if (clean) {
    commons.io.deleteFolderRecursive(output);
  }
  var dataFile = getDataFile(data);
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
          var currentData = customizeData(currentTemplate, dataFile);
          metaInstance.parseTemplate(
            scope,
            currentTemplate,
            currentData,
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
@function parseTemplate (public) [Parse all templates in include and callback with result for each one]
@param include {[string]} [Included template patterns]
@param exclude {[string]} [Excluded template patterns]
@param data {[string]} [Data object, folder or array of folders to search for data]
@param callback
@param argv {object} [Parametters for callback]
*/
exports.parseTemplate = function(scope, include, exclude, data, callback, argv) {
  var dataFile = getDataFile(data);
  var allTemplates = commons.io.getFiles(include, exclude);
  if (allTemplates.length > 0) {
    filesToWrite = 0;
    allTemplates.forEach(function(templates) {
      if (templates.files.length > 0) {
        templates.files.forEach(function(template) {
          filesToWrite++;
          var currentTemplate = path.join(templates.root, template);
          var currentData = customizeData(currentTemplate, dataFile);
          metaInstance.parseTemplate(
            scope,
            currentTemplate,
            currentData,
            function(result) {
              if (callback) {
                callback(currentTemplate, currentData, result, argv);
              }
            }
          );
        });
      }
    });
  }
};


/*
@function parse (public) [Parse data and callback with result]
@param templateData {object} [Template as text]
@param data {[string]} [Data object, folder or array of folders to search for data]
@param callback
*/
exports.parse = function(scope, templateData, data, callback) {
  var dataFile = getDataFile(data);
  metaInstance.parse(
    scope,
    templateData,
    dataFile,
    function(result) {
      if (callback) {
        callback(result);
      }
    }
  );
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
    .option("-c, --clean <item>", "Empty directory before generate")
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
    path.join(cwd, "**/*.vmt"),
  ];
  var output = program.output || path.resolve(cwd);
  var data = program.data || {};
  var exclude = program.exclude || defaultExclude;
  var clean = program.clean || false;

  exports.parseTemplateWrite(null, include, exclude, output, data, clean);
}


/*
@function getDataFile (private) {object} [Read data from files]
@param data {[string]} [Data can be: Object, folder, pattern or an array of folders or patterns]
 */
function getDataFile(data) {
  if (!Array.isArray(data) && typeof data === "object") {
    return data;
  } else {
    var files = commons.io.getFiles(data);
    return readData(commons.io.absoluteFiles(files));
  }
}

/*
@function writeToDisk (private)
@param output {string} [Output folder]
@param result {string} [Data to write]
@param callback
 */
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

/*
@function readData (private) {object} [Read data from an array of files and merge them]
@param dataPath {[string]} [Array of paths]
 */
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

/*
@function customizeData (private) {object} [Check in data if current template has special keys]
@param template
@param data
 */
function customizeData(template, data) {
  if (data) {
    // Unlink data with current custom data
    var customData = JSON.parse(JSON.stringify(data));
    // Check patterns data first because custom data has priority and will overwrite patterns data
    if (data.__vim) {
      if (data.__vim.patterns) {
        for (var patternsKey in data.__vim.patterns) {
          if (commons.io.isInPattern(template, patternsKey)) {
            for (var inPatternsKey in data.__vim.patterns[patternsKey]) {
              customData[inPatternsKey] = data.__vim.patterns[patternsKey][inPatternsKey];
            }
          }
        }
      }
      // Check custom data
      if (data.__vim.custom) {
        for (var customKeys in data.__vim.custom) {
          if (commons.io.isInPattern(template, customKeys)) {
            for (var inCustomKey in data.__vim.custom[customKeys]) {
              customData[inCustomKey] = data.__vim.custom[customKeys][inCustomKey];
            }
          }
        }
      }
    }
    return customData;
  } else {
    return data;
  }
}


/*
@function merge {object} (private) [Merge two objects]
@param obj {object}
@param src {object}
 */
function merge(obj, src) {
  Object.keys(src).forEach(function(key) {
    obj[key] = src[key];
  });

  return obj;
}

function list(val) {
  return val.split(",");
}
