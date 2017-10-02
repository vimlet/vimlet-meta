define(function (require) {
    
    // Import intern modules
    var registerSuite = require("intern!object");
    var assert = require("intern/chai!assert");

    // Import node module
    var nodeExample = require("intern/dojo/node!../example/node-example");

    registerSuite({
        "Hello Test": function () {         
            assert.equal(nodeExample.sayHello(), "hello", "Return isn't hello");
        },
        // 'failing test': function () {
        //     var result = 2 * 3;
        //     assert.equal(result, 5, 'Addition operator should add numbers together');
        // }

    });

});