// Make base accessible from the required scope
module.exports = require("./lib/meta-base").instance();

// Switch to node engine mode
module.exports.engine = "node";

// Function overloading and node standard(error, data) callbacks 
var baseParse = module.exports.parse;

module.exports.parse = function () {
    convertToNodeCallback(baseParse).apply(null, arguments);
};

// Converts any callback to a standard(error, data) callback
// NOTE: Only single param callback is supported
// NOTE: Callback must be the last param
function convertToNodeCallback(fn) {
  return function() {
    var lastArgPosition = arguments.length -1;    
    var callback = arguments[lastArgPosition];
    try {
      arguments[lastArgPosition] = function(data) {
        callback(null, data);
      }
      fn.apply(null, arguments);  
    }catch(error) {
      callback(error);
    }
  };
}