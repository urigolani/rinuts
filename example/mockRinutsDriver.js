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

        for (key in this.tests) {
            if (this.tests.hasOwnProperty(key)) {
                tests.push({
                    name: this.tests[key].name,
                    identifier: this.tests[key].name // the indentifier to appeneded to the get response, e.g \tests\testoddnumbers
                });
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