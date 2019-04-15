const {
    suite,
    test
} = intern.getInterface("tdd");
const {
    assert
} = intern.getPlugin("chai");

var meta = require("../../../../src/node");
var path = require("path");

suite("parseTemplateGlob", () => {
    test("parseTemplateGlob", () => {        
        meta.parseTemplateGlob(path.join(__dirname, "../resources/result.vmt"), null, function (error, data) {   
            var result = data.result.replace(/\\n/gm,"_").replace(/\s/gm,"_").trim();
            assert.strictEqual(result, 'Hola_Richard_Happy_B-day!____Hello_i\'m_result_AWESOME!____---_Start_template1__I_am_template2__I\'m_template3__I\'m_template4__---_End_template1__I\'m_template5____This_is_an_echo_test_AWESOME!_YEP!',
                "The expected output is: 'Hola_Richard_Happy_B-day!____Hello_i\'m_result_AWESOME!____---_Start_template1__I_am_template2__I\'m_template3__I\'m_template4__---_End_template1__I\'m_template5____This_is_an_echo_test_AWESOME!_YEP!'");
        });
    });
});