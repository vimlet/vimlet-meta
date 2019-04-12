const {
    suite,
    test
} = intern.getInterface("tdd");
const {
    assert
} = intern.getPlugin("chai");

var meta = require("../../../../src/node");
var path = require("path");

suite("parseTemplate", () => {
    test("parseTemplate", () => {
        meta.parseTemplate(path.join(__dirname, "../resources/template.vmt"), null, function (error, data) {            
            assert.strictEqual(data, 'I am a template without includes',
                "The expected output is: 'I am a template without includes'");
        });
    });
    test("parseTemplateInclude", () => {
        meta.parseTemplate(path.join(__dirname, "../resources/template1.vmi"), null, function (error, data) {                      
            assert.strictEqual(data, '--- Start template1\r\nI am template2\r\nI\'m template3\r\nI\'m template4\r\n--- End template1',
                "The expected output is: '--- Start template1\r\nI am template2\r\nI\'m template3\r\nI\'m template4\r\n--- End template1'");
        });
    });
});