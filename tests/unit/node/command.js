const {
    suite,
    test
} = intern.getInterface("tdd");
const {
    assert
} = intern.getPlugin("chai");

var metaBin = "src/node";
var path = require("path");
var fs = require("fs");
var run = require("@vimlet/commons-run");

var include = path.join(__dirname, "resources/**/result.vmt");
var output = path.join(__dirname, "output/command");
var data = path.join(__dirname, "resources/data.json");

suite("command", () => {
    test("command", () => {
        run.exec("node", {
            args: [metaBin, "-i", include, "-o", output, "-d", data, "-c"]
        }, function (error, data) {
            if (error) {
                console.error(error);
            } else {
                fs.readFile(path.join(__dirname, "output/command/result"), "utf8", function (error, fileContent) {
                    var result = fileContent.replace(/(\r\n|\n|\r)/gm, "_&_");
                    var expected = "Hola Richard Happy B-day!_&__&_Hello i'm result AWESOME!_&__&_--- Start template1_&_I am template2_&_I'm template3_&_I'm template4_&_--- End template1I'm template5_&__&_This is an echo test AWESOME! YEP!";
                    assert.strictEqual(result, expected, "The expected output is: " + expected);
                });
            }
        });
    });
});