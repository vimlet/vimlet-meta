#!/usr/bin/env node

//@header Parse templates into files.
var io = require("@vimlet/commons-io");
var path = require("path");
var glob = require("glob");
var fs = require("fs-extra");
var cli = require("@vimlet/cli").instantiate();
var watch = require("./lib/watch");
var cwd = process.cwd();


module.exports.instance = function () {
  // Node require
  var require_vm;

  var instance = require("./lib/meta-base").instance();

  // Switch to node engine mode
  // @property engine [Engine to run (node|browser)]
  instance.engine = "node";

  // Override sandboxProvider;
  instance.__sandboxProvider = function (sandbox) {

    if (!require_vm) {
      require_vm = require("vm");
    }

    // Clone node global scope to baseContext
    var baseContext = Object.assign({}, sandbox);

    // Add other node global modules to baseContext
    baseContext.exports = exports;
    baseContext.require = require;
    baseContext.module = module;
    baseContext.__filename = __filename;
    baseContext.__dirname = __dirname;

    return require_vm.createContext(baseContext);
  };

  // Override evalProvider for node
  instance.__evalProvider = function (s, sandbox) {
    var script = new require_vm.Script(s);
    script.runInContext(sandbox);
  };

  // Override fileProvider for node
  instance.__fileProvider = function (filePath, callback) {
    var fixedPath = filePath;
    if (filePath.indexOf("/") === 0) { // /path means that current path start from working directory
      if (filePath.indexOf(cwd) < 0) { // Avoid linux absolute path issue starting by /
        fixedPath = path.join(cwd, filePath);
      }
    } else {
      fixedPath = path.join("./", filePath);
    }
    if (callback) {
      // Must be asynchronous
      fs.readFile(fixedPath, "utf8", function (error, buf) {
        if (!error) {
          callback(buf.toString());
        }
      });
    } else {
      // Must be synchronous    
      try {
        return fs.readFileSync(fixedPath, "utf8").toString();
      } catch (error) {
        if (error.path) {
          console.log();
          console.log("Error, file not found: ", error.path);
          console.log();
        } else {
          console.log(error);

        }
      }
    }
  };


  // Function overloading and node standard(error, data) callbacks 
  var baseParse = instance.parse;
  var baseParseTemplate = instance.parseTemplate;

  instance.parse = function (text, options, callback) {
    return baseParse(text, options, callback);
  }

  instance.parseTemplate = function (template, options, callback) {
    return baseParseTemplate(template, options, callback);
  }


  // Node engine specific functions
  // @function parseTemplateGlob (public) [Parse templates from glob patterns and return a result object containing relativePath and result] @param include @param options [exclude: to skip files, data] @param callback
  instance.parseTemplateGlob = async function (include, options, callback) {
    if (!callback) {
      return new Promise(function (resolve, reject) {
        instance.parseTemplateGlob(include, options, function (error, data) {
          error ? reject(error) : resolve(data);
        });
      });
    }
    options = options || {};
    var rootsArray = await io.getFiles(include, options);
    var empty = true;
    rootsArray.forEach(function (rootObject) {
      rootObject.files.forEach(function (relativePath) {
        empty = false;
        instance.parseTemplate(path.join(rootObject.root, relativePath), options, function (error, data) {
          callback(error, {
            relativePath: relativePath,
            result: data
          });
        });
      });
    });
    if (empty) {
      callback(new Error("No files"));
    }
  };

  // @function parseTemplateGlobAndWrite (public) [Parse templates from glob patterns and write the result to disk] @param include @param output [Output folder, it respects files structure from include pattern] @param options [exclude: to skip files, data and clean: to empty destination folder] @param callback
  instance.parseTemplateGlobAndWrite = async function (include, output, options, callback) {
    if (!callback) {
      return new Promise(function (resolve, reject) {
        instance.parseTemplateGlobAndWrite(include, output, options, function (error) {
          error ? reject(error) : resolve();
        });
      });
    }
    options = options || {};
    if (options.clean) {
      await io.deleteFolderRecursive(output);
    }
    instance.parseTemplateGlob(include, options, function (error, data) {
      if (error) {
        callback(error);
      } else {
        if (data && output) {
          // Write data to output without .vmt extension
          var fileOutput = path.join(output, data.relativePath).replace(".vmt", "");
          fs.mkdirs(path.dirname(fileOutput), function () {
            fs.writeFile(fileOutput, data.result, function () {
              if (!("log" in options) || options.log) {
                console.log("->", fileOutput);
              }
              callback();
            });
          });
        } else if (!data) {
          callback(new Error("notFound"));
        } else {
          callback(new Error("syntaxError"));
        }
      }
    });
  };

  // @function parseTemplateGlobAndWriteSync (public) [Parse templates from glob patterns and write the result to disk] @param include @param output [Output folder, it respects files structure from include pattern] @param options [exclude: to skip files, data and clean: to empty destination folder]
  instance.parseTemplateGlobAndWriteSync = async function (include, output, options) {
    options = options || {};
    if (options.clean) {
      io.deleteFolderRecursiveSync(output);
    }
    await instance.parseTemplateGlob(include, options, function (error, data) {
      if (error) {
        throw error;
      } else {
        if (data && output) {
          // Write data to output without .vmt extension
          var fileOutput = path.join(output, data.relativePath).replace(".vmt", "");
          fs.mkdirsSync(path.dirname(fileOutput));
          fs.writeFileSync(fileOutput, data.result);
          if (!("log" in options) || options.log) {
            console.log("->", fileOutput);
          }
        } else if (!data) {
          throw new Error("notFound");
        } else {
          throw new Error("syntaxError");
        }
      }
    });
  };


  // @function watch (public) [Parse templates from glob patterns and keep listen for changes] @param include @param output [Output folder, it respects files structure from include pattern] @param options [exclude: to skip files, data and clean: to empty destination folder, watchdirectory:watch directories for changes and compile watch files] @param callback
  instance.watch = function (include, output, options) {
    var watcher = [];
    options = options || {};
    var optionsCopy = JSON.parse(JSON.stringify(options));
    if (options.data && typeof options.data != "object") {
      var currentPath = options.data;
      if (!path.isAbsolute(currentPath)) {
        currentPath = path.join(cwd, options.data);
      }
      if (fs.existsSync(currentPath)) {
        optionsCopy.data = JSON.parse(fs.readFileSync(currentPath));
      }
    }
    instance.parseTemplateGlobAndWrite(include, output, optionsCopy);
    watcher.push(watch.watch(include, output, options));
    if (options && options.watchdirectory) {
      watcher.push(watch.watchDirectory(options.watchdirectory, options.exclude, function () {
        var optionsCopy = JSON.parse(JSON.stringify(options));
        if (options.data && typeof options.data != "object") {
          var currentPath = options.data;
          if (!path.isAbsolute(currentPath)) {
            currentPath = path.join(cwd, options.data);
          }
          fs.stat(currentPath, function (err, data) {
            if (!err) {
              fs.readJson(currentPath, function (error, data) {
                if (!error) {
                  optionsCopy.data = JSON.parse(fs.readFileSync(currentPath));
                  instance.parseTemplateGlobAndWrite(include, output, optionsCopy);
                }
              });
            }
          });
        } else {
          instance.parseTemplateGlobAndWrite(include, output, optionsCopy);
        }
      }));
    }
    return watcher;
  };

  return instance;
};




// Command mode
if (!module.parent) {

  var cliMetaInstance = module.exports.instance();

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
    .flag("-nl", "--nolog", "Prevent console from printing logs")
    .flag("-p", "--preventCommented", "Prevent removal of wrapped templates")
    .value("-w", "--watch", "Keeps watching for changes")
    .flag("-h", "--help", "Shows help")
    .parse(process.argv);


  var readData = null;
  if (cli.result.data) {
    var currentPath = cli.result.data;
    if (!path.isAbsolute(currentPath)) {
      currentPath = path.join(cwd, cli.result.data);
    }

    if (fs.existsSync(currentPath)) {
      readData = JSON.parse(fs.readFileSync(currentPath));
    }
  }
  if (cli.result.preventCommented) {
    cliMetaInstance.parseCommented = false;
  }

  var include = cli.result.include || path.join(cwd, "**/*.vmt");
  var exclude = cli.result.exclude || "**node_modules**";
  var data = readData || {};
  var output = cli.result.output || cwd;
  var clean = cli.result.clean || false;
  var log = cli.result.nolog ? !cli.result.nolog : true;

  var options = {};
  options.exclude = exclude;
  options.data = data;
  options.clean = clean;
  options.log = log;


  if (cli.result.help) {
    cli.printHelp();
  } else {
    if (cli.result.watch) {
      options.data = cli.result.data ? cli.result.data : options.data;
      if (typeof (cli.result.watch) != "boolean") {
        options.watchdirectory = cli.result.watch;
      }
      cliMetaInstance.watch(include, output, options);
    } else {
      cliMetaInstance.parseTemplateGlobAndWriteSync(include, output, options);
    }
  }

}