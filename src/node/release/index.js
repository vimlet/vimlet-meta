#!/usr/bin/env node

'use strict';

// Require
var generator = require('./lib/base');
var generatorInstance = generator.instance();

// Generator node config
generatorInstance.engine = "node";

// Interpreter
this.instance = function() {
  return generator.instance();
};

// Command
var program = require('commander');
var fs = require('fs-extra');
var yaml = require('js-yaml');
var getDirName = require('path').dirname;
var path = require('path');

/**
 * Public function to call from module
 * @param  {[type]} template [description]
 * @param  {[type]} output   [description]
 * @param  {[type]} data     [description]
 * @return {[type]}          [description]
 */
exports.parse = function(template, output, data) {
  var dataFile = getDataFile(data);
  generatorInstance.parseTemplate(template, function(result) {
    writeToDisk(output, result);
  }, dataFile);
};

var list = function(val) {
  return val.split(',');
};

// Command mode
if (!module.parent) {
  program
    .version('0.0.1')
    .option('-t, --template <item>', 'Add template')
    .option('-d, --data <item, item...>', 'Add data', list)
    .option('-o, --output <item>', 'Add output')
    .parse(process.argv);


  if (program.template && program.data && program.output) {

    program.template = path.resolve(program.template);
    program.output = path.resolve(program.output);

    var dataFile = getDataFile(program.data);

    generatorInstance.parseTemplate(program.template, function(result) {
      writeToDisk(program.output, result);
    }, dataFile);

  }
}

/**
 * Read data from file or return if JSON
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function getDataFile(data) {
  if (!Array.isArray(data) && typeof(data) === "object") {
    return data;
  } else {
    var dataFile = {};
    // If data is directory then take all json files
    var isDirectory = false;
    try {
      if (fs.lstatSync("" + data).isDirectory()) {
        isDirectory = true;
      }
    } catch (exception) {}
    if (isDirectory) {
      dataFile = readFolderData(data);
    } else {
      dataFile = readData(data);
    }
    return dataFile;
  }
}


function writeToDisk(output, result) {

  fs.mkdirp(getDirName("" + output), function(err) {

    if (err) {
      return console.log(err);
    }

    fs.writeFile("" + output, result, function(err) {

      if (err) {
        return console.log(err);
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

      if (currentPath.split('.').pop() == "yml") {

        try {

          var doc = yaml.load(fs.readFileSync(currentPath, "utf8"));
          tempData = JSON.stringify(doc);
          tempData = JSON.parse(tempData);
          dataFile = merge(dataFile, tempData);

        } catch (e) {
          console.log('Can not read yml.');
        }

      } else if (currentPath.split('.').pop() == "json") {

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

var list = function(val) {
  return val.split(',');
};
