var meta = require("../../../src/node");
var commons = require("@vimlet/commons");


var scope = null;
var include = "resources/hello.txt.vmt";
var exclude = null;
var data = null;
var output = "output"
var callback = function(err,data){
    console.log("Done"); 
};


meta.parseTemplateGlobAndWrite(include, output, null, callback);