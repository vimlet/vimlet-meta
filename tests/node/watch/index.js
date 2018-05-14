var meta = require("../../../src/node");
var path = require("path");


meta.watch(path.join(__dirname, "resources/**"), path.join(__dirname, "output"));
