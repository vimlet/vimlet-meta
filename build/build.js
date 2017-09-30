var fs = require("fs");
var path = require("path");

var baseFile = fs.readFileSync(path.join(__dirname, "../src/base/meta-base.js"));


// --- Build node ---

var nodeBase = "";
nodeBase += "exports.instance = function() {\n\n";
nodeBase += baseFile.toString();
nodeBase += "\n\nreturn generator;\n\n";
nodeBase += "}";

fs.writeFileSync(path.join(__dirname, "../src/node/release/lib/meta-base.js"), nodeBase);

// --- Build browser ---

fs.writeFileSync(path.join(__dirname, "../src/browser/release/vimlet-meta.js"), baseFile);
