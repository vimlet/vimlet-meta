var metaBin = "../../../src/node";
var commons = require("@vimlet/commons");
var path = require("path");

var include = path.join(__dirname, "resources/**/*.vmt");
var output = path.join(__dirname, "output");

commons.run.exec("node", {args:[metaBin, "-i", include, "-o", output]}, function (error, data) {
  if (error) {
    console.error(error);
  } else {
    console.log("done!");
  }
});


// commons.run.exec("node", [metaBin, "-i", "**/*.vmt", "-h"], null, null, function (error, data) {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log("done!");
//   }
// });


// commons.run.exec("node", [metaBin, "-i", "**/*.vmt", "-d", "resources/data.json"], null, null, function (error, data) {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log("done!");
//   }
// });

// commons.run.exec("node", [metaBin, "-i", "**/*.vmt", "-d", "resources/data.json", "-o", "output", "-w", "resources"], null, null, function (error, data) {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log("done!");
//   }
// });

// commons.run.exec("node", [metaBin], null, null, function (error, data) {
//     if (error) {
//       console.error(error);
//     } else {
//       console.log("done!");
//     }
//   });