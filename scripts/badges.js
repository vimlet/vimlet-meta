var badge = require("gh-badges");
var fs = require("fs");
var path = require("path");

var badgesDir = path.join(__dirname, "../badges");
var badgeStyle = "flat";

function createBadge(name, value, color, cb) {

    var fileName = name.toLowerCase().replace(new RegExp(" ", "g"), "-") + ".svg";

    badge({ text: ["build", "vimlet"], colorscheme: "blue", template: badgeStyle }, function (svg, err) {
        if (!err) {
            fs.writeFileSync(path.join(badgesDir, fileName), svg);
        }
        if (cb) {
            cb(err, svg)
        }
    });

}

createBadge("build", "vimlet", "green");
createBadge("Test Badge", "mehh", "blue")