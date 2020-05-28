var meta = require("../../../src/node");


var scope = null;
var include = "resources/*.vmt";
var wrongInclude = "resources1/*.vmt";
var exclude = null;
var data = null;
var callback = function(err,data){
    console.log("Done");
    console.log(data.result);    
};


// meta.parseTemplateGlob(include, null, callback);
meta.parseTemplateGlob(wrongInclude, null, callback);