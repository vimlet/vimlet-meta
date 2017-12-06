var watch = require('glob-watcher');
var path = require("path");
var commons = require("../node_modules/@vimlet/commons");
var meta = require("../index.js");
var fs = require("fs-extra");

exports.watch = function(include, exclude, output, data, callback) {
  var watcher = watch(include);
  watcher.on('change', function(filePath, stat) {
    if (!isExcluded(exclude, filePath)) {
      // Relative output is where the template will be saved after parsed
      var relativeOutput = getRelativeOutput(include, output, filePath);
      // Parse modified file
      meta.parseTemplateWrite(null, filePath, null, relativeOutput, data, false, callback);
    }
  });
  watcher.on('add', function(filePath, stat) {
    if (!isExcluded(exclude, filePath)) {
      // Relative output is where the template will be saved after parsed
      var relativeOutput = getRelativeOutput(include, output, filePath);
      // Parse modified file
      meta.parseTemplateWrite(null, filePath, null, relativeOutput, data, false, callback);
    }
  });
  watcher.on('unlink', function(filePath, stat) {
    if (!isExcluded(exclude, filePath)) {
      // Relative output is where the template will be saved after parsed
      var relativeOutput = getRelativeOutput(include, output, filePath, true);
      console.log("filePath",filePath);
      console.log("relativeOutput",relativeOutput);
      var parsedPath = path.join(relativeOutput, path.basename(filePath,path.extname(filePath)));
      fs.unlinkSync(parsedPath);
    }
  });
};

/*
@function getRelativeOutput [Get path relative to output]
@param include [Include patterns]
 @param output
  @param filePath
  @param deleted [Flag to know if the file was deleted so it skips file in patter check]
 */
function getRelativeOutput(include, output, filePath, deleted) {
  var relativeOutput;
  if (!Array.isArray(include)) {
    if (commons.io.isInPattern(filePath, include) || deleted) {
      var rootFromPattern = commons.io.getRootFromPattern(include);
      // Relative output is where the template will be saved after parse
      relativeOutput = path.dirname(path.relative(rootFromPattern, filePath));
      relativeOutput = path.join(output, relativeOutput);
    }
  } else {
    include.forEach(function(incl) {
      if (commons.io.isInPattern(filePath, incl)) {
        var rootFromPattern = commons.io.getRootFromPattern(incl);
        // Relative output is where the template will be saved after parse
        relativeOutput = path.dirname(path.relative(rootFromPattern, filePath));
        relativeOutput = path.join(output, relativeOutput);
      }
    });
  }
  return relativeOutput;
}

/*
@function isExcluded [Check if a file is excluded. This function is used because watch doesn't accept exclude patterns]
@param excluded [exclude patterns]
@param filePath
@return boolean
 */
function isExcluded(excluded, filePath) {
  if (!Array.isArray(excluded)) {
    return commons.io.isInPattern(filePath, excluded);
  } else {
    var isIn = false;
    excluded.forEach(function(excl) {
      if (commons.io.isInPattern(filePath, excl)) {
        isIn = true;
      }
    });
    return isIn;
  }
}
