exports.instance = function() {

  // MODE: INTERPRETER
  // - client (browser)
  // - server (node)
  //
  // MODE: COMMAND	(node)


  var vimlet = vimlet || {};
  
    vimlet.meta = vimlet.meta || {};
  
    (function () {
      // Node require
      var require_fs;
      var require_vm;
  
      // Engine [browser, node]
      vimlet.meta.engine = vimlet.meta.engine || "browser";
  
      // Tags Array [tagOpen, tagClose, tagEcho]
      vimlet.meta.tags = vimlet.meta.tags || ["<%", "%>", "="];
  
      //Line break replacement
      vimlet.meta.lineBreak = vimlet.meta.lineBreak || null;
  
  
      vimlet.meta.parse = function (scope, text, data, callback) {
        vimlet.meta.__setTags();
        var __sandbox = vimlet.meta.__createSandbox(scope);
        __sandbox.data = data || {};
        var result = __sandbox.__parse(text);
        vimlet.meta.__destroySandbox(__sandbox);
        callback(result);
      };
  
      vimlet.meta.parseTemplate = function (scope, template, data, callback) {
        vimlet.meta.__setTags();
        var __sandbox = vimlet.meta.__createSandbox(scope);
        __sandbox.data = data || {};
        var result = __sandbox.__parseTemplate(template);
        vimlet.meta.__destroySandbox(__sandbox);
        callback(result);
      };
  
      // Initialize tags
      vimlet.meta.__setTags = function () {
        // Tags
        vimlet.meta.__tagOpen = vimlet.meta.tags[0];
        vimlet.meta.__tagClose = vimlet.meta.tags[1];
        vimlet.meta.__tagEcho = vimlet.meta.tags[2];
  
        // Regex
        vimlet.meta.__regex = new RegExp(
          vimlet.meta.__escapeRegExp(vimlet.meta.__tagOpen) +
          "(?:(?!" +
          vimlet.meta.__escapeRegExp(vimlet.meta.__tagOpen) +
          ")[\\s\\S])*" +
          vimlet.meta.__escapeRegExp(vimlet.meta.__tagClose) +
          "(\\r\\n|\\r|\\n){0,1}",
          "g"
        );
      };
  
      // Escape special characters from tags
      vimlet.meta.__escapeRegExp = function (str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
      };
  
      // Sanitize given string.
      vimlet.meta.sanitize = function (s) {
        s = s.replace(vimlet.meta.__tagOpen, "");
        s = s.replace(vimlet.meta.__tagClose, "");
        return s;
      };
  
      vimlet.meta.__getFile = function (path, callback) {
        if (vimlet.meta.engine == "node") {
          // node command
          if (!require_fs) {
            require_fs = require("fs");
          }
  
          if (callback) {
            // Must be asynchronous
            require_fs.readFile(path, "utf8", function (error, buf) {
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
        } else {
          // TODO replace XMLHttpRequest by window.fetch with synchronous support
          // Browser
          var xhttp = new XMLHttpRequest();
  
          xhttp.onreadystatechange = function () {
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
  
      vimlet.meta.__createSandbox = function (scope) {
        var sandbox = eval.call(null, "this");
  
        if (vimlet.meta.engine == "node") {
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
  
        // Inject scope
        if (scope) {
          sandbox.context = scope;
        }
  
        // Inject sandbox functions
        vimlet.meta.__injectSanboxFunctions(sandbox);
  
        return sandbox;
      };
  
      vimlet.meta.__destroySandbox = function (sandbox) {
        if (vimlet.meta.engine == "browser") {
          var iframe = sandbox.frameElement;
          iframe.parentNode.removeChild(iframe);
        }
  
        sandbox = null;
      };
  
      vimlet.meta.__injectSanboxFunctions = function (sandbox) {
        sandbox.__output = "";
  
        sandbox.__basePath = "";
  
        sandbox.echo = function (s) {
          sandbox.__output += s;
        };
  
        sandbox.template = function (t) {
          var __fullPath = sandbox.__basePath + "/" + t;
          sandbox.__output += sandbox.__parseTemplate(__fullPath);
        };
  
        sandbox.__eval = function (s, basepath) {
          sandbox.__output = "";
          sandbox.__basePath = basepath;
  
          if (vimlet.meta.engine == "node") {
            var script = new require_vm.Script(s);
            script.runInContext(sandbox);
          } else {
            sandbox.eval.call(null, s);
          }
  
          return sandbox.__output;
        };
  
        sandbox.__parse = function (t, templatePath) {
          var result = "";
          var evalResult = [];
  
          if (!templatePath) {
            templatePath = "";
          }
  
          // Eval matches
          var matches = t.match(vimlet.meta.__regex);
          var endOfLine = "";
  
          if (matches) {
            for (var i = 0; i < matches.length; i++) {
              endOfLine = vimlet.meta.__preserveNewLineIfNeeded(matches[i]);
              matches[i] = vimlet.meta.__cleanMatch(matches[i]);
              evalResult.push(
                sandbox.__eval(matches[i], vimlet.meta.__getBasePath(templatePath)) + endOfLine
              );
            }
          }
  
          // Replace template with evalMatches
          var j = 0;
          result = t.replace(vimlet.meta.__regex, function () {
            return evalResult[j++]; // returns previous value
          });
  
          //Replace line break.
          if (vimlet.meta.lineBreak) {
            result = result.replace(
              new RegExp("[\\r\\n|\\r|\\n]+", "g"),
              vimlet.meta.lineBreak
            );
          }
  
          return result;
        };
  
        sandbox.__parseTemplate = function (templatePath) {
          // Get file must be synchronous
          var tContent = vimlet.meta.__getFile(templatePath);
          // Call template parser
          return sandbox.__parse(tContent, templatePath);
        };
  
      };
  
      vimlet.meta.__getBasePath = function (f) {
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
  
      vimlet.meta.__cleanMatch = function (match) {
        // Remove new line
        match = match.trim();
  
        // Remove tags
        match = match
          .substring(
          vimlet.meta.__tagOpen.length,
          match.length - vimlet.meta.__tagClose.length
          )
          .trim();
  
        // Echo shortcut
        if (match.startsWith(vimlet.meta.__tagEcho)) {
          match =
            "echo(" +
            match.substring(vimlet.meta.__tagEcho.length, match.length).trim() +
            ");";
        }
  
        return match;
      };
  
      vimlet.meta.__preserveNewLineIfNeeded = function (match) {
  
        // Remove start spaces with regex since trimLeft is not IE compatible
        match = match.replace(/^\s+/,"");
  
        var endOfLine = "";
        
        // Return endOfLine if echo found
        if (match.match(new RegExp("(^" + vimlet.meta.__tagOpen + vimlet.meta.__tagEcho +  "|echo(.*);)", "g"))) {
          
          // Determine match end of line
          var endsWithNewLine = match.match(new RegExp("(\\r\\n$|\\r$|\\n$)", "g"));
  
          if (endsWithNewLine) {
            endOfLine = endsWithNewLine[0];
          }
  
        }
  
        return endOfLine;
      };
  
    }.apply(vimlet.meta));

return vimlet.meta;

}