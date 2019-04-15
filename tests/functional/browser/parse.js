const {
    suite,
    test
} = intern.getInterface("tdd");
const {
    assert
} = intern.getPlugin("chai");

var fs = require("fs");
var path = require("path");

// Copy vmeta.js
function copy() {
    return new Promise(function (resolve, reject) {
        fs.copyFile(path.join(__dirname, "../../../src/browser/vmeta.js"), path.join(__dirname, "../../webapp/vmeta.js"), function (error) {  
            resolve();
        });
    });
}
async function waitCopy() {
    await copy();
}
waitCopy();

suite("browser", () => {
    test("parse", ({
        remote
    }) => {
        return remote.get(intern.config.remoteUrl + "/parse.html").sleep(1000).executeAsync(function (callback) {
            parse(callback);
        }).then(function (value) {            
            assert.strictEqual(value, "This is meta");
        });
    });
    test("parseTemplate", ({
        remote
    }) => {
        return remote.get(intern.config.remoteUrl + "/parse.html").sleep(1000).executeAsync(function (callback) {
            parseTemplate(callback);
        }).then(function (value) {                        
            assert.strictEqual(value, "I am template2");
        });
    });
    test("parseIncludeTemplate", ({
        remote
    }) => {
        return remote.get(intern.config.remoteUrl + "/parse.html").sleep(1000).executeAsync(function (callback) {
            parseIncludeTemplate(callback);
        }).then(function (value) {                 
            assert.strictEqual(value, "This is meta I am template2");
        });
    });
    test("parseIncludeTemplatePathToRoot", ({
        remote
    }) => {
        return remote.get(intern.config.remoteUrl + "/parse.html").sleep(1000).executeAsync(function (callback) {
            parseIncludeTemplatePathToRoot(callback);
        }).then(function (value) {        
            assert.strictEqual(value.replace(/(\r\n|\n|\r)/gm,"_&_"), "This is meta I am template2 Next  I'm template3_&_I'm template4_&_I'm template5");
        });
    });
});