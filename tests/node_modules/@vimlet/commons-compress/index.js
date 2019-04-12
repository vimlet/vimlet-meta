#!/usr/bin/env node

var fs = require("fs-extra");
var path = require("path");
var compressing = require("compressing");
var pipe = require("multipipe");
var progress = require("@vimlet/commons-progress");
var io = require("@vimlet/commons-io");
var cli = require("@vimlet/cli").instantiate();
var os = require("os");
var glob = require("glob");
var copy = require("@vimlet/commons-copy");
var deasync = require("deasync");

var tmpFolder = path.join(os.tmpdir(), "compress");

// Hook _onEntryFinish(err) of stream.js
function hookOnEntryFinish(stream, fn) {
  // NOTE this might break on future releases of compressing module,
  // Using exact version on package.json is recommended to stay safe
  // (Compressing Module Version: 1.2.3)

  var originalFunction = stream._onEntryFinish;

  stream._onEntryFinish = function (err) {
    // Current entries befire shift()
    if (this._waitingEntries && this._waitingEntries.length > 0) {
      fn(this._waitingEntries[0][0]);
    }

    originalFunction.apply(this, arguments);
  };
}

/*
@function pack
@description Packs files
@param {string} file [Source file or directory]
@param {string} dest [Destination file]
@param {string} format [The compression format, must exactly match one of these "zip", "tar", "tgz"]
@param {object} options [packHandler: Entry callback function(error, entry, entrySize, totalSize, totalCount), outputHandler: Default output callback function(out), redirects stdout when provided. format: The compression format, must exactly match one of these "zip", "tar", "tgz"]
@param doneHandler [Default done callback function(error, data)]
*/
exports.pack = function (file, dest, options, doneHandler) {
  fs.ensureDirSync(path.dirname(dest));
  options = options || {};
  var format = options.format || "zip";
  if (isValidFormat(format)) {
    packHelper(file, dest, format, options.packHandler, options.outputHandler, doneHandler, options);
  } else {
    outputStdout("Unsupported format", options.outputHandler);
  }
};
/*
@function packSync
@description Packs files synchronous
@param {string} file [Source file or directory]
@param {string} dest [Destination file]
@param {string} format [The compression format, must exactly match one of these "zip", "tar", "tgz"]
@param {object} options [packHandler: Entry callback function(error, entry, entrySize, totalSize, totalCount), outputHandler: Default output callback function(out), redirects stdout when provided. format: The compression format, must exactly match one of these "zip", "tar", "tgz"]
*/
exports.packSync = function (file, dest, options) {
  var done = false;
  var data;
  exports.pack(file, dest, options, function cb(res){
    data = res;
    done = true;
  });
  deasync.loopWhile(function(){return !done;});
};


/*
@function unpack
@description Unpack files
@param {string} file [Source file or directory]
@param {string} dest [Destination file]
@param {object} options [unpackHandler: Entry callback function(error, entry, entrySize, totalSize, totalCount), outputHandler: Default output callback function(out), redirects stdout when provided. format: The compression format, must exactly match one of these "zip", "tar", "tgz"]
@param doneHandler [Default done callback function(error, data)]
*/
exports.unpack = function (file, dest, options, doneHandler) {
  options = options || {};
  var format = options.format || "zip";
  if (isValidFormat(format)) {
    unpackHelper(file, dest, format, options.unpackHandler, options.outputHandler, doneHandler);
  } else {
    outputStdout("Unsupported format", options.outputHandler);
  }
};
/*
@function unpackSync
@description Unpack files syncronous
@param {string} file [Source file or directory]
@param {string} dest [Destination file]
@param {object} options [unpackHandler: Entry callback function(error, entry, entrySize, totalSize, totalCount), outputHandler: Default output callback function(out), redirects stdout when provided. format: The compression format, must exactly match one of these "zip", "tar", "tgz"]
*/
exports.unpackSync = function (file, dest, options) {
  var done = false;
  var data;
  exports.unpack(file, dest, options, function cb(res){
    data = res;
    done = true;
  });
  deasync.loopWhile(function(){return !done;});
};


function isValidFormat(format) {
  format = format.toLowerCase();
  return format === "zip" || format === "tar" || format === "tgz";
}

function getStreamObject(stream) {
  var baseStream = stream;

  if (!baseStream._onEntryFinish) {
    // Must be tgz
    baseStream = stream._tarStream;
  }

  return baseStream;
}

function packHelper(file, dest, format, packHandler, outputHandler, doneHandler, options) {
  outputStdout("\nPacking " + file + "\n", outputHandler);
  if (Array.isArray(file) && file.length === 1) {
    file = file[0];
  }
  if (Array.isArray(file) || glob.hasMagic(file)) {
    copy.copy(file, tmpFolder, options, function () {
      packFiles(tmpFolder, dest, format, packHandler, outputHandler, doneHandler, true);
    });
  } else {
    packFiles(file, dest, format, packHandler, outputHandler, doneHandler);
  }
}

// @function packFiles (private) [Pack files]
function packFiles(file, dest, format, packHandler, outputHandler, doneHandler, isTemporal) {
  var sizeObject = getPackSizeObject(getFileList(file));
  var fileStream = new compressing[format].Stream();
  var streamObject = getStreamObject(fileStream);

  var totalCount = sizeObject.count;
  var totalSize = sizeObject.totalSize;
  var totalProgress = 0;

  var currentEntry;
  var currentEntrySize;

  var progressHandler = packHandler ? null : progress.progressHandler(totalSize, 99, null, outputHandler);

  hookOnEntryFinish(streamObject, function (entry) {
    if (!io.isDirectory(entry)) {
      // Store currentEntry
      currentEntry = entry;

      // Update size
      currentEntrySize = sizeObject.files[entry];

      if (packHandler) {
        // Custom progress
        packHandler(null, currentEntry, currentEntrySize, totalSize, totalCount);
      }

      // File count fallback
      if (sizeObject.useFileCount) {
        totalProgress += 1;
        totalSize = totalCount;
      } else {
        totalProgress += currentEntrySize;
      }

      // Default progress
      progressHandler.showProgressChange(totalProgress);

    }
  });

  // Add file or directories
  if (io.isDirectory(file) && isTemporal) {
    fileStream.addEntry(file, {
      ignoreBase: true
    });
  } else {
    fileStream.addEntry(file);
  }

  var destStream = fs.createWriteStream(dest);

  pipe(fileStream, destStream, function (error) {
    if (error) {
      // Make sure we return something
      if (error == "") {
        error = "true";
      }

      if (packHandler) {
        packHandler(error);
      }

      outputStdout(error, outputHandler);

    } else {
      if (packHandler) {
        packHandler(true);
      }

      // Show 100%;
      progressHandler.showProgress(100);
      outputStdout("\n", outputHandler);

    }

    if (doneHandler) {
      doneHandler(error);
      if (isTemporal) {
        io.deleteFolderRecursiveSync(tmpFolder);
      }
    } else {
      if (isTemporal) {
        io.deleteFolderRecursiveSync(tmpFolder);
      }
    }

  });

}

function unpackHelper(file, dest, format, unpackHandler, outputHandler, doneHandler) {

  outputStdout("\nUnpacking " + file + "\n", outputHandler);

  // Make dest directory
  fs.mkdirsSync(dest);

  if (Array.isArray(file)) {
    unpackArray(file, dest, format, unpackHandler, outputHandler, doneHandler);
  } else {
    unpackFile(file, dest, format, unpackHandler, outputHandler, doneHandler);
  }
}

// @function unpackArray (private) [Unpack files recursivelly]
function unpackArray(file, dest, format, unpackHandler, outputHandler, doneHandler) {
  var current = file.shift();
  if (file.length > 0) {
    unpackFile(current, dest, format, unpackHandler, outputHandler, function () {
      unpackArray(file, dest, format, unpackHandler, outputHandler, doneHandler);
    });
  } else {
    unpackFile(current, dest, format, unpackHandler, outputHandler, doneHandler);
  }
}


// @function unpackFile (private) [Unpack files]
function unpackFile(file, dest, format, unpackHandler, outputHandler, doneHandler) {
  getUpackSizeObject(file, format, function (sizeObject) {
    var totalCount = sizeObject.count;
    var totalSize = sizeObject.totalSize;
    var totalProgress = 0;

    var currentEntry;
    var currentEntrySize;

    var progressHandler = unpackHandler ? null : progress.progressHandler(totalSize, 99, null, outputHandler);

    var fileStream = new compressing[format].UncompressStream({
      source: file
    });

    fileStream.on("finish", function () {
      if (unpackHandler) {
        handler(true);
      }

      // Show 100%;
      progressHandler.showProgress(100);
      outputStdout("\n", outputHandler);


      if (doneHandler) {
        setTimeout(function () {
          doneHandler();
        }, 0);
      }

    });

    fileStream.on("error", function (error) {
      // Make sure we return something
      if (!error || error == "") {
        error = "true";
      }

      if (unpackHandler) {
        unpackHandler(error);
      }

      outputStdout(error, outputHandler);


      if (doneHandler) {
        doneHandler(error);
      }
    });

    fileStream.on("entry", function (header, stream, next) {
      // Store currentEntry
      currentEntry = path.join(dest, header.name);

      // Update size
      currentEntrySize = getEntryUncompressedSize(header);

      // Write entry
      onUnpackEntryWrite(header, stream, next, dest);

      if (unpackHandler) {
        // Custom progress
        unpackHandler(
          null,
          currentEntry,
          currentEntrySize,
          totalSize,
          totalCount
        );
      }

      // File count fallback
      if (sizeObject.useFileCount) {
        totalProgress += 1;
        totalSize = totalCount;
      } else {
        totalProgress += currentEntrySize;
      }

      // Default progress
      progressHandler.showProgressChange(totalProgress);

    });

  }, outputHandler);

}


function getEntryUncompressedSize(header) {
  var sizeProperty = "size";
  var sizeValue;
  var size = 0;

  if (header.yauzl) {
    sizeProperty = "yauzl.uncompressedSize";
  }

  size = resolveObject(sizeProperty, header);

  return size == null || typeof size == "undefined" ? -1 : size;
}

function getUpackSizeObject(file, format, callback, outputHandler) {
  // Will attempt to find the total size in bytes of the UncompressStream, if not possible
  // file count will be provided instead

  var sizeObject = {
    useFileCount: false,
    totalSize: 0,
    count: 0
  };

  var fileStream = new compressing[format].UncompressStream({
    source: file
  });

  fileStream.on("finish", function () {
    callback(sizeObject);
  });

  fileStream.on("error", function (error) {
    sizeObject.count = -1;
    outputStdout(error, outputHandler);
  });

  fileStream.on("entry", function (header, stream, next) {
    var sizeValue = getEntryUncompressedSize(header);

    if (sizeValue != -1) {
      sizeObject.totalSize += sizeValue;
    } else {
      sizeObject.useFileCount = true;
    }

    sizeObject.count++;

    // Must resume to avoid stream block
    stream.resume();
    next();
  });
}

// Recursive function
function getFileList(dir, fileList) {
  fileList = fileList || [];
  var files = io.absoluteFiles(io.getFiles(dir));
  files.forEach(function (file) {
    fileList.push(file);
  });
  return fileList;
}

function getPackSizeObject(fileList) {
  var sizeObject = {
    useFileCount: false,
    totalSize: 0,
    count: fileList.length,
    files: {}
  };

  var file;
  var size;

  for (var i = 0; i < fileList.length; i++) {
    file = fileList[i];
    size = io.getFileSize(file);

    if (size == -1) {
      sizeObject.useFileCount = true;
    }

    sizeObject.files[file] = size;
    sizeObject.totalSize += size;
  }

  return sizeObject;
}

function onUnpackEntryWrite(header, stream, next, dest) {
  // header.type => file | directory
  // header.name => path name

  stream.on("end", next);

  if (header.type === "file") {
    var file = path.join(dest, header.name);
    var parent = path.dirname(file);

    try {
      fs.mkdirsSync(parent);
    } catch (error) {
      // Do nothing
    }

    stream.pipe(fs.createWriteStream(file));
  } else {
    // directory
    // Note this is just per compressing API specification but never triggers
    fs.mkdirsSync(path.join(dest, header.name));
    stream.resume();
  }
}

/*
@function outputStdout
@description Outputs a string to the stdout unless an outputHandle is provided
@param {string} s [The string to output]
@param-optional {function} outputHandler [The callback(out) that will receive output instead of stdout]
*/
function outputStdout(s, outputHandler) {
  if (outputHandler) {
    outputHandler(s);
  } else {
    process.stdout.write(s);
  }
}

/*
@function {object} resolveObject
@description Access nested object properties by path
@param {string} path [Path of the property]
@param {object} obj [The object that contains the property]
*/
function resolveObject(path, obj) {
  return path.split(".").reduce(function (prev, curr) {
    return prev ? prev[curr] : undefined;
  }, obj || self);
}



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
    .value("-f", "--format", "Compression format")
    .flag("-p", "--pack", "Pack files")
    .flag("-u", "--unpack", "Unpack files")
    .flag("-h", "--help", "Shows help")
    .parse(process.argv);

  var cwd = process.cwd();

  var include = cli.result.include || path.join(cwd, "**/*.*");
  var exclude = cli.result.exclude || "**node_modules**";
  var output = cli.result.output || cwd;
  var format = cli.result.format || "zip";

  var options = {};
  options.exclude = exclude;
  options.format = format;

  if (cli.result.help) {
    cli.printHelp();
  } else {
    if (cli.result.unpack) {
      exports.unpackSync(include, output, options);
    } else {
      exports.packSync(include, output, options);
    }
  }

}