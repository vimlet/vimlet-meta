#!/usr/bin/env node

"use strict";

// Require
var meta = require("./lib/meta-base");
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

/**
 * Public function to call from module
 * @param  {[type]} template [description]
 * @param  {[type]} output   [description]
 * @param  {[type]} data     [description]
 * @return {[type]}          [description]
 */
exports.parse = function(template, output, data, callback) {
  var dataFile = getDataFile(data);
  metaInstance.parseTemplate(
    template,
    dataFile,
    function(result) {
      writeToDisk(output, result, callback);
    }
  );
};

// node index.js -t "../../tests/main.md.vim" -d "../../tests/data.json" -o "../../tests/salida.md"

// Command mode
if (!module.parent) {
  program
    .version("0.0.1")
    .option("-t, --template <item>", "Add template")
    .option("-d, --data <item, item...>", "Add data", list)
    .option("-o, --output <item>", "Add output")
    .parse(process.argv);

  if (program.template && program.data && program.output) {
    program.template = path.resolve(program.template);
    program.output = path.resolve(program.output);
    var dataFile = getDataFile(program.data);

    metaInstance.parseTemplate(
      program.template,
      dataFile,
      function(result) {
        writeToDisk(program.output, result);
      }
    );
  }
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
