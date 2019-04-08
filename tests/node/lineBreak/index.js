var commons = require("@vimlet/commons");
var chrome = "start chrome";

var meta = require("../../../src/node");
var path = require("path");
var fs = require("fs-extra");

var data = fs.readJsonSync(path.join(__dirname, 'resources/data.json'));

var expectedResult = "Name: Peter. Last: Pan\r\n\r\nAfter line break\r\nNext line will be empty tag\r\nAfter empty tag\r\nNext line will be a tag with echo\r\necho\r\nLast line was echo\r\nNext line will include a template\r\nText from include template\r\nNext line will include an empty template which will be skipped\r\nI am after empty template";

// Works without errors because it just parse .vmt files
meta.parseTemplateGlobAndWrite(path.join(__dirname, "resources/**/*.vmt"), path.join(__dirname, "output"), {data:data});

var result = fs.readFileSync(path.join(__dirname, "output/template.txt"), "utf8");

if(expectedResult === result){
    console.log("Test passed");
}else{
    console.log("Test fail");    
}