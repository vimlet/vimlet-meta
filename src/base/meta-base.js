// MODE: INTERPRETER
// - client (browser)
// - server (node | nashorn)
//
// MODE: COMMAND	(node)

var generator = generator || {};

(function() {
  // Node require
  var require_fs;
  var require_vm;

  // Engine [browser, node, nashorn]
  generator.engine = generator.engine || "browser";

  // Tags Array [tagOpen, tagClose, tagEcho]
  generator.tags = generator.tags || ["<%", "%>", "="];

  //Line break replacement
  generator.lineBreak = generator.lineBreak || null;

  generator.parseTemplate = function(template, callback, data, context) {
    // Tags
    generator.__tagOpen = generator.tags[0];
    generator.__tagClose = generator.tags[1];
    generator.__tagEcho = generator.tags[2];

    // Regex
    generator.__regex = new RegExp(
      generator.__escapeRegExp(generator.__tagOpen) +
        "(?:(?!" +
        generator.__escapeRegExp(generator.__tagOpen) +
        ")[\\s\\S])*" +
        generator.__escapeRegExp(generator.__tagClose) +
        "(\\r\\n|\\r|\\n){0,1}",
      "g"
    );

    var __sandbox = generator.__createSandbox(context);

    __sandbox.data = data || {};

    var result = __sandbox.__parseTemplate(template);

    generator.__destroySandbox(__sandbox);

    callback(result);
  };

  //Esacape special characters from tags
  generator.__escapeRegExp = function(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  };

  //Sanitize given string.
  generator.sanitize = function(s) {
    s = s.replace(generator.__tagOpen, "");
    s = s.replace(generator.__tagClose, "");
    return s;
  };

  generator.__getFile = function(path, callback) {
    if (generator.engine == "node") {
      // node command
      if (!require_fs) {
        require_fs = require("fs");
      }

      if (callback) {
        // Must be asynchronous
        require_fs.readFile(path, "utf8", function(error, buf) {
          if (error) {
            console.log(error);
          } else {
            callback(buf.toString());
          }
        });
      } else {
        // Must be synchronous
        return require_fs.readFileSync(path, "utf8").toString();
      }
    } else if (generator.engine == "nashorn") {
      // TODO nashorn get file

      if (callback) {
        // Must be asynchronous
      } else {
        // Must be synchronous
      }
    } else {
      // TODO replace XMLHttpRequest by window.fetch with synchronous support
      // Browser
      var xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
          if (this.status === 200) {
            if (callback) {
              // Must be asynchronous
              callback(xhttp.responseText);
            }
          } else {
            console.log("File error: " + this.status);
          }
        }
      };

      if (callback) {
        // Must be asynchronous
        xhttp.open("GET", path, true);
        xhttp.send();
      } else {
        // Must be synchronous
        xhttp.open("GET", path, false);
        xhttp.send();
        return xhttp.responseText;
      }
    }
  };

  generator.__createSandbox = function(context) {
    var sandbox = eval.call(null, "this");

    if (generator.engine == "node") {
      if (!require_vm) {
        require_vm = require("vm");
      }

      // Clone node global scope to baseContext
      var baseContext = Object.assign({}, sandbox);

      // Add other node global modules to baseContext

      // exports
      // require
      // module
      // __filename
      // __dirname

      baseContext.exports = exports;
      baseContext.require = require;
      baseContext.module = module;
      baseContext.__filename = __filename;
      baseContext.__dirname = __dirname;

      sandbox = new require_vm.createContext(baseContext);
    } else if (generator.engine == "nashorn") {
      // TODO nashorn sandbox
    } else {
      // Browser sandbox
      iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.setAttribute(
        "sandbox",
        "allow-same-origin allow-scripts allow-popups allow-forms"
      );
      document.body.appendChild(iframe);
      sandbox = iframe.contentWindow;
    }

    // Inject context
    if (context) {
      sandbox.context = context;
    }

    // Inject sandbox functions
    generator.__injectSanboxFunctions(sandbox);

    return sandbox;
  };

  generator.__destroySandbox = function(sandbox) {
    if (generator.engine == "browser") {
      var iframe = sandbox.frameElement;
      iframe.parentNode.removeChild(iframe);
    }

    sandbox = null;
  };

  generator.__injectSanboxFunctions = function(sandbox) {
    sandbox.__output = "";

    sandbox.__basePath = "";

    sandbox.echo = function(s) {
      sandbox.__output += s;
    };

    sandbox.template = function(t) {
      var __fullPath = sandbox.__basePath + "/" + t;
      sandbox.__output += sandbox.__parseTemplate(__fullPath);
    };

    sandbox.__eval = function(s, basepath) {
      sandbox.__output = "";
      sandbox.__basePath = basepath;

      if (generator.engine == "node") {
        var script = new require_vm.Script(s);
        script.runInContext(sandbox);
      } else if (generator.engine == "nashorn") {
        // TODO nashorn eval
      } else {
        sandbox.eval.call(null, s);
      }

      return sandbox.__output;
    };

    sandbox.__parseTemplate = function(t) {
      var result = "";
      var evalResult = [];

      // Get file must be synchronous
      var file = generator.__getFile(t);

      // Eval matches
      var matches = file.match(generator.__regex);

      if (matches) {
        for (var i = 0; i < matches.length; i++) {
          matches[i] = generator.__cleanMatch(matches[i]);
          evalResult.push(
            sandbox.__eval(matches[i], generator.__getBasePath(t))
          );
        }
      }

      // Replace template with evalMatches
      var j = 0;
      result = file.replace(generator.__regex, function() {
        return evalResult[j++]; // returns previous value
      });

      //Replace line break.
      if (generator.lineBreak) {
        result = result.replace(
          new RegExp("[\\r\\n|\\r|\\n]+", "g"),
          generator.lineBreak
        );
      }

      return result;
    };
  };

  generator.__getBasePath = function(f) {
    // Replace Windows separators
    var standarPath = f.replace(/\\/g, "/");
    var path = standarPath.split("/");

    var base = "";

    if (standarPath.includes("/")) {
      // Remove last part of the path
      for (var i = 0; i < path.length - 1; i++) {
        base += "/" + path[i];
      }

      // Remove first /
      base = base.substring(1, base.length);
    }

    return base;
  };

  generator.__cleanMatch = function(match) {
    // Remove new line
    match = match.trim();

    // Remove tags
    match = match
      .substring(
        generator.__tagOpen.length,
        match.length - generator.__tagClose.length
      )
      .trim();

    // Echo shortcut
    if (match.startsWith(generator.__tagEcho)) {
      match =
        "echo(" +
        match.substring(generator.__tagEcho.length, match.length).trim() +
        ");";
    }

    return match;
  };
}.apply(generator));
