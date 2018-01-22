var meta = require("@vimlet/meta");
var path = require("path");

meta.watch(null, path.join(__dirname, "../../../resources/**"), null, null, path.join(__dirname, "../../../output"), true);
