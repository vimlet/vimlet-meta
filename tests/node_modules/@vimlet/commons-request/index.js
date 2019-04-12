var path = require("path");
var fs = require("fs-extra");
var request = require("request");
var progress = require("@vimlet/commons-progress");

/*
@function download
@description Downloads a file
@param {string} url [The URL source to download]
@param {string} dest [The place where the downloaded file will be stored]
@param-optional {object} options [downloadHandler: A progress callback function(received, total, statusCode), outputHandler: Default output callback function(out), redirects stdout when provided]
@param-optional {function} doneHandler [Default done callback function(error, status)]
*/

exports.headers = {};

exports.download = function (url, dest, options, doneHandler) {
  options = options || {};
  var progressHandler;

  // Save variable to know progress
  var receivedBytes = 0;
  var totalBytes = 0;

  var req = request({
    method: "GET",
    uri: url,
    headers: exports.headers
  });

  var destPath = path.resolve(dest);
  var destDirectory = path.dirname(destPath);

  var doDownload = false;

  req.on("response", function (data) {
    // Handle the statusCode
    if (options.downloadHandler) {
      options.downloadHandler(null, null, data.statusCode);
    }

    if (data.statusCode >= 200 && data.statusCode < 400) {
      doDownload = true;

      output("\nDownloading " + url + "\n", options.outputHandler);

      // Change the total bytes value to get progress later
      totalBytes = parseInt(data.headers["content-length"]);
      progressHandler = progress.progressHandler(totalBytes, 99, null, options.outputHandler);

      // Make parent directories
      fs.mkdirsSync(destDirectory);

      var writer = fs.createWriteStream(destPath);

      // Note we wait till file finish writing
      writer.on("finish", function () {
        if (doDownload) {

          progressHandler.showProgress(100);
          output("\n", options.outputHandler);

          if (doneHandler) {
            doneHandler();
          }

        }

      });

      // Pipe dest output
      req.pipe(writer);

    } else {

      // Show failed message if no downloadHandler found
      output("Download failed, response " + data.statusCode, options.outputHandler);

      // Trigger doneHandle if statusCode is an invalid download code
      if (doneHandler) {
        var error = data.statusCode + "";

        // Make sure we return something
        if (!error || error == "") {
          error = "true";
        }

        doneHandler(error);
      }

    }
  });

  req.on("data", function (chunk) {
    if (doDownload) {
      // Update the received bytes
      receivedBytes += chunk.length;

      if (options.downloadHandler) {
        options.downloadHandler(receivedBytes, totalBytes);
      }

      // Default progress
      progressHandler.showProgressChange(receivedBytes);

    }
  });

  req.on("error", function (error) {

    // Make sure we return something
    if (!error || error == "") {
      error = "true";
    }

    if (doneHandler) {
      doneHandler(error);
    }

    output(error, options.outputHandler);

  });
};

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