define(function (require) {
    
    // Import intern modules
    var registerSuite = require("intern!object");
    var assert = require("intern/chai!assert");

    // Import node module
    // var example = require("intern/dojo/node!../example/node-example");

    registerSuite({
        "passing test": function () {   
            var result = 2 + 3;      
            assert.equal(result, 5, "This test will always pass");
        },
        // "failing test": function () {
        //     var result = 2 * 3;
        //     assert.equal(result, 5, "This test will always fail");
        // }
    });

});