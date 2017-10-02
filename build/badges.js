var badge = require("gh-badges");
var fs = require("fs");
var path = require("path");

var readmePath = path.join(__dirname, "../README.md");
var readmeFile = fs.readFileSync(readmePath).toString();

// TODO wrap function with standard node callback
badge({ text: ["build", "vimlet"], colorscheme: "green", template: "flat" }, function (svg, err) {
    // svg is a String of your badge.
    readmeFile = replaceBadge(readmeFile, "build", svg);
    fs.writeFileSync(readmePath, readmeFile);

    badge({ text: ["tests", "richardson!"], colorscheme: "blue", template: "flat" }, function (svg, err) {
        // svg is a String of your badge.
        readmeFile = replaceBadge(readmeFile, "tests", svg);
        fs.writeFileSync(readmePath, readmeFile);
    });
    
});

function replaceBadge(fileText, badge, badgeText) {
    var tag = generateBadgeTag(badge);
    var regex = tag + "[\\s\\S]*" + tag;
    var text = tag + badgeText + tag;
    return fileText.replace(new RegExp(regex), text);
}

function generateBadgeTag(badge) {
    return "<!--- badge:" + badge + " --->";
}