var meta = require("../../../src/node");
var path = require("path");


// meta.watch("resources/**/*.vmt", path.join(__dirname, "output"), {});
meta.watch("resources/**/*.vmt", path.join(__dirname, "output"), {watchdirectory:"resources"});
