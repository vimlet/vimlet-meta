// @property {boolean} paintSimple [Enables or disables simple output mode]
exports.paintSimple = false;

/*
@function paintProgress
@description Prints progress at a given percent
@param {number} value [Progress percent]
@param-optional {function} outputHandler [Default output callback function(out), redirects stdout when provided]
*/
exports.paintProgress = function (value, outputHandler) {

  if (exports.paintSimple) {
    output(value + "%", outputHandler);
  } else {
    var bar = "";
    var max = 50;
    var progress = Math.floor(value * max / 100);

    for (var index = 0; index < progress; index++) {
      bar += "=";
    }

    for (var index = 0; index < max - progress; index++) {
      bar += "-";
    }

    output("[" + bar + "] " + value + "%\r", outputHandler);

    if (value == 100) {
      output("\n", outputHandler);
    }
  }
};

/*
@function {number} showProgress
@description Prints progress percent by value and total and returns the percent
@param {number} value [Current progress value]
@param-optional {object} options [paintProgress: Function that actually does the painting. total: Total progress value]
@param-optional {function} outputHandler [Default output callback function(out), redirects stdout when provided]
*/
exports.showProgress = function (value, options, outputHandler) {
  options = options || {};
  if (value && options.total) {
    value = calcPercent(value, options.total);
  }

  if (value > 0 && value <= 100) {
    if (options.paintProgress) {
      options.paintProgress(value, outputHandler);
    } else {
      exports.paintProgress(value, outputHandler);
    }

    return value;
  }

  return -1;
};

/*
@function {object} progressHandler
@description Handle progress painting avoiding duplicated output of the same progress
@param {number} total [Total percent value]
@param {number} max [Provide a virtual limit that avoids printing over this value]
@param-optional {object} options [paintProgress: Function that actually does the painting]
@param-optional {function} mainOutputHandler [Default output callback function(out), redirects stdout when provided]
*/
exports.progressHandler = function (total, max, options, mainOutputHandler) {
  options = options || {};
  var handlerObject = {
    total: total,
    max: max,
    progress: -1,
    paintProgress: options.paintProgress,
    showProgressChange: function (value, total, paintProgress, outputHandler) {

      if(!outputHandler) {
        outputHandler = mainOutputHandler;
      }

      if (!total) {
        total = this.total;
      }

      if (!this.max) {
        this.max = 100;
      }

      if (!this.paintProgress) {
        this.paintProgress = paintProgress ? paintProgress : exports.paintProgress;
      }

      var percent = calcPercent(value, total);

      if (this.progress != percent && percent <= max) {
        this.progress = percent;
        return exports.showProgress(this.progress, {"paintProgress":this.paintProgress}, outputHandler);
      }
    },
    showProgress: function (value, total, paintProgress, outputHandler) {
      
      if(!outputHandler) {
        outputHandler = mainOutputHandler;
      }

      if (!this.paintProgress) { 
        this.paintProgress = paintProgress ? paintProgress : exports.paintProgress;
      }

      return exports.showProgress(value, {"total":total,"paintProgress":this.paintProgress}, outputHandler);
    }
  };

  return handlerObject;
};

function calcPercent(value, total) {
  return Math.ceil(value * 100 / total);
}

/*
@function output
@description Outputs a string to the stdout unless an outputHandle is provided
@param {string} s [The string to output]
@param-optional {function} outputHandler [The callback(out) that will receive output instead of stdout]
*/
function output (s, outputHandler) {
  if (outputHandler) {
    outputHandler(s);
  } else {
    process.stdout.write(s);
  }
}