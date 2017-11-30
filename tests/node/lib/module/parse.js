var path = require("path");

var meta = require("../../../../src/node");
var templateData = "<% function getAge(age){ return age; } %> This template simply call a function and it prints the result via echo. <% echo('Result age is: ' + getAge(data.age))%> ";
var data = path.join(__dirname, "../../source/manualTest/data.json");

meta.parse(null, templateData, data, function(result){
  console.log(result);
});
