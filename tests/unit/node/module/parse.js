const {
    suite,
    test
} = intern.getInterface("tdd");
const {
    assert
} = intern.getPlugin("chai");

var meta = require("../../../../src/node");
var path = require("path");

var template = "Hello i'm a template! <%= \"AWESOME!\" %>";
var templateBasePath = "Hello i'm a template! <% template('"+path.join(__dirname,'../resources/template2.vmi')+"'); %> Next  <% template('../resources/within/template3.vmi'); %>";
// var templateBasePath = "Hello i'm a template! <% template('../resources/template2.vmi'); %> Next  <% template('../resources/within/template3.vmi'); %>";

suite("parse", () => {
    test("parse", () => {
        meta.parse(template, null, function (error, data) {
            assert.strictEqual(data, "Hello i'm a template! AWESOME!",
                "The expected output is: Hello i'm a template! AWESOME!");
        });
    });
    test("parseBasePath", () => {
        meta.parse(templateBasePath, {
            basePath: "../resources"
        }, function (error, data) {
            console.log("ERRRO", error);
            console.log(data);
            


            // assert.strictEqual(data, "Hello i'm a template! AWESOME!",
            //     "The expected output is: Hello i'm a template! AWESOME!");
        });
    });
});