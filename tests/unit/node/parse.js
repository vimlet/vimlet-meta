const {
    suite,
    test
} = intern.getInterface("tdd");
const {
    assert
} = intern.getPlugin("chai");

var meta = require("../../../src/node");

var template = "Hello i'm a template! <%= \"AWESOME!\" %>";
var templateBasePath = "Hello i'm a template! <% template('template2.vmi'); %> Next  <% template('within/template3.vmi'); %>";

suite("parse", () => {
    test("parse", () => {
        meta.parse(template, null, function (error, data) {
            assert.strictEqual(data, "Hello i'm a template! AWESOME!",
                "The expected output is: Hello i'm a template! AWESOME!");
        });
    });
    test("parseBasePath", () => {
        meta.parse(templateBasePath, {
            basePath: "tests/unit/node/resources"
        }, function (error, data) {
            var result = data.replace(/(\r\n|\n|\r)/gm,"_&_"); 
            var expected = 'Hello i\'m a template! I am template2 Next  I\'m template3_&_I\'m template4_&_I\'m template5';
            assert.strictEqual(result, expected,
                "The expected output is: " + expected);
        });
    });
});