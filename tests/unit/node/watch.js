const {
    suite,
    test
} = intern.getInterface("tdd");
const {
    assert
} = intern.getPlugin("chai");
var meta = require("../../../src/node").instance();
var path = require("path");
var fs = require("fs");

if (fs.existsSync(path.join(__dirname, "../resources/test.vmt"))) {
    fs.unlinkSync(path.join(__dirname, "../resources/test.vmt"));
}
if (fs.existsSync(path.join(__dirname, "../resources/testInclude.vmt"))) {
    fs.unlinkSync(path.join(__dirname, "../resources/testInclude.vmt"));
}

// suite("watch", () => {
//     test("watchAdd", () => {
//         var watcher = meta.watch(path.join(__dirname, "../resources/**/*.vmt"), path.join(__dirname, "../output/watch"),{watchdirectory:path.join(__dirname, "../resources")});
//         setTimeout(() => {
//             fs.writeFile(path.join(__dirname, "../resources/test.vmt"), "Testing watcher", function () {                
//                 setTimeout(() => {
//                     fs.readFile(path.join(__dirname, "../output/watch/test"), "utf8",
//                         function (error, data) {
//                             console.log(data);
                            
//                             setTimeout(() => {
//                                 console.log("CLOSE");
                                
//                                 watcher.forEach(function(w){
//                                     w.close();
//                                 });
//                             }, 500);
//                             // assert.strictEqual(data, "Testing watcher", "The expected output is: " + "Testing watcher");
//                         });
                    
//                         // watcher.forEach(function(w){
//                         //     w.close();
//                         // });
//                 }, 500);
//                 // watcher.forEach(function(w){
//                 //     w.close();
//                 // });
//             });
//         }, 1000);
//     });
//     // test("watchInclude", () => {
//     //     var watcher = meta.watch(path.join(__dirname, "../resources/**/*.vmt"), path.join(__dirname, "../output/watch"));
//     //     setTimeout(() => {
//     //         fs.writeFile(path.join(__dirname, "../resources/testInclude.vmt"), "Testing watcher <% template('template2.vmi'); %>", function () {
//     //             setTimeout(() => {
//     //                 fs.readFile(path.join(__dirname, "../output/watch/testInclude"), "utf8",
//     //                     function (error, data) {
//     //                         console.log(data);

//     //                         // assert.strictEqual(data, "Testing watcher I am template2", "The expected output is: " + "Testing watcher I am template2");
//     //                         watcher.close();
//     //                     });
//     //             }, 500);
//     //         });
//     //     }, 1000);
//     //     // var fileContent = fs.readFileSync(path.join(__dirname, "../output/result"), "utf8");          
//     //     // var result = fileContent.replace(/(\r\n|\n|\r)/gm,"_&_"); 
//     //     // var expected = "Hola Richard Happy B-day!_&__&_Hello i'm result AWESOME!_&__&_--- Start template1_&_I am template2_&_I'm template3_&_I'm template4_&_--- End template1I'm template5_&__&_This is an echo test AWESOME! YEP!";            
//     //     // assert.strictEqual(result, expected, "The expected output is: " + expected);
//     // });
// });