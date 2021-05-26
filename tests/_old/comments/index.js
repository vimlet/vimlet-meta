var commons = require("@vimlet/commons");
var chrome = "start chrome";
var meta = require("../../../src/node").instance();
var path = require("path");

meta.parseTemplateGlobAndWrite(path.join(__dirname, "resources/**/*.vmt"), path.join(__dirname, "output"), {exclude:"resources/excluded/*", clean:true});

