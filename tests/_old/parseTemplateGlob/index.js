var meta = require("../../../src/node");
var commons = require("@vimlet/commons");


var scope = null;
var include = "resources/hello.txt.vmt";
var exclude = null;
var data = null;
var callback = function(err,data){
    console.log("Done");
    console.log(data.result);    
};


meta.parseTemplateGlob(include, null, callback);