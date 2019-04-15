const {
    suite,
    test
} = intern.getInterface("tdd");
const {
    assert
} = intern.getPlugin("chai");

var meta = require("../../../src/node");
var path = require("path");
var fs = require("fs");

suite("parseTemplateGlobAndWrite", () => {
    test("parseTemplateGlobAndWrite", () => {        
        meta.parseTemplateGlobAndWrite(path.join(__dirname, "resources/result.vmt"), path.join(__dirname, "output"), {clean:true}, function () {
            fs.readFileSync(path.join(__dirname, "output/result"), "utf8", function(error, fileContent){
                var result = fileContent.replace(/(\r\n|\n|\r)/gm,"_&_"); 
                var expected = "Hola Richard Happy B-day!_&__&_Hello i'm result AWESOME!_&__&_--- Start template1_&_I am template2_&_I'm template3_&_I'm template4_&_--- End template1I'm template5_&__&_This is an echo test AWESOME! YEP!";            
                assert.strictEqual(result, expected, "The expected output is: " + expected);
            });          
        });
    });
});