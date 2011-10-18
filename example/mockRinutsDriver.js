var driver = function (tests) {
    this.init(tests);
};

module.exports = driver;

driver.prototype = {
    init: function (tests) {
        this.tests = tests;

    },
    enumTests: function (callback) {
        var tests = [],
            key;

        console.log(this.tests.length);
        for (key in this.tests) {
            if (this.tests.hasOwnProperty(key)) {
                tests.push(this.tests[key].name);
            }
        }

        callback(null, tests);
    },
    runTest: function (testName, callback, context) {
        var test = this.tests[testName],
            responseFormat = {
                name: testName,
                state: test.method()
            };

        callback(null, responseFormat);
    }
};