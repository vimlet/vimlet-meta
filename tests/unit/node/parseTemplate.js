const {
    suite,
    test
} = intern.getInterface("tdd");
const {
    assert
} = intern.getPlugin("chai");

var meta = require("../../../src/node");
var path = require("path");

suite("parseTemplate", () => {
    // test("parseTemplate", () => {
    //     meta.parseTemplate(path.join(__dirname, "resources/template.vmt"), null, function (error, data) {            
    //         assert.strictEqual(data, 'I am a template without includes',
    //             "The expected output is: 'I am a template without includes'");
    //     });
    // });
    test("parseTemplateInclude", () => {   
        console.log("PARSETEMOLATE");     
        meta.parseTemplate(path.join(__dirname, "resources/template1.vmi"), {fixUnicode:false}, function (error, data) {                      
            var result = data.replace(/(\r\n|\n|\r)/gm,"_&_"); 
            var expected = "--- Start template1_&_I am template2_&_I'm template3_&_I'm template4_&_--- End template1";
            assert.strictEqual(result, expected,
                "The expected output is: " + expected);
        });
    });
});