var meta = require("../../../src/node");
var path = require("path");

//meta.watch(null, path.join(__dirname, "resources/**/*.vmt"), null, null, path.join(__dirname, "output"), true);
meta.watch(null, path.join(__dirname, "resources/**"), null, null, path.join(__dirname, "output"), true);