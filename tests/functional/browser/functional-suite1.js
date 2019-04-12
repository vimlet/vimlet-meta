const { suite, test } = intern.getInterface("tdd");
const { assert } = intern.getPlugin("chai");

suite("functional-suite1", () => {
    test("functional-test1", ({ remote }) => {
        return remote.get(intern.config.remoteUrl + "/functional-test1.html").sleep(1000).executeAsync(function (callback) {
            doTest(callback);
        }).then(function (value) {
            assert.strictEqual(value, true);
        });
    });
});