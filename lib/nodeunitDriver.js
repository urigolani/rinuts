//jslint igonres
/*globals module, console, require */

var reporter = require('./singleTestReporter'),
    fs = require('fs'),

// 
// private methods:

//
// enumarates a group of tests by recursivly flatenning the tree-like structure which nodeunit tests posses through groups,
// applying a formatter function on each test that determines the test's data structure.
// test names are prefixed by their containing group followed by a '.'
// returns an array of tests after applying the formatter on each of them.
    mapTestTree = function (group, formatter, namePrefix) {
        var tests = [],
            key,
            test,
            testName;

        function addTest(test) {
            tests.push(test);
        }

        for (key in group) {
            if (group.hasOwnProperty(key)) {
                if (typeof group[key] === 'function') {
                    testName = namePrefix ? namePrefix + key : key;
                    test = formatter(group[key], testName);
                    addTest(test);
                } else { // else key is a group of tests
                    mapTestTree(group[key], formatter, (namePrefix ? (namePrefix + key + '.') : (key + '.'))).forEach(addTest);
                }
            }
        }

        console.log('tests in mapTestTree are : ' + tests);
        return tests;
    },

    //
    // Checks if a given path is a directory and applies 'cb' on the boolean result
    isDirectory = function (path, cb) {
        fs.stat(path, function (err, stat) {
            if (err) {
                cb(err);
                return;
            }

            if (stat.isDirectory()) {
                cb(null, true);
            } else {
                cb(null, false);
            }
        });
    },

    //
    // Loads all tests contained in 'module'.
    // Applies 'callback' on each of the contained tests.
    loadModule = function (module, callback) {
        var tests = [];              
                
        tests = mapTestTree(module, function (test, testName) {
            return {
                testName: testName,                
                metadata: test
            };
        });       

        callback(tests);
    },

    //
    // Loads all tests contained in the file at 'filePath'.
    // Applies 'callback' on each of the contained tests.
    loadfile = function (filePath, callback) {
        var module = require(filePath);

        loadModule(module, callback);
    },

    //
    // Loads tests from files and subdirectories contained in the directory at 'dirPath'.
    // Applies 'callback' on each of the contained tests.
    loadDir = function (dirPath, callback) {
        fs.readdir(dirPath, function (err, list) {
            if (err) {
                callback(err);
                return;
            }

            list.forEach(function (file) {
                file = dirPath + '/' + file;
                isDirectory(file, function (err, result) {
                    if (err) {
                        callback(err);
                        return;
                    }

                    if (result === true) {
                        loadDir(file, callback);
                    } else {
                        loadfile(file, callback);
                    }
                });
            });
        });
    },

    //
    // the nodeunit driver class
    nodeunitDriver = function (moduleNames) {
        this.init(moduleNames);
    };

// expose nodeunitDriver
module.exports = nodeunitDriver;

nodeunitDriver.prototype = {
    //
    // A dictionary of test names and their data.
    // each test has the following form: 
    // {
    //     testName:   *THE NAME OF THE TEST*    
    //     metaData: *DATA REQUIRED IN ORDER TO RUN THE TEST*
    // }
    tests: {},

    //
    // Loads every node module appearing in modules
    // modules {object | array | string}: a nodeunit module | a path to nodeunit file | a path to a directory containing 
    //      nodeunit modules | an array containing any of the previous.
    init: function (modules) {
        var self = this,
            module,
            addTests = function (tests) {
                tests.forEach(function (test) {
                    self.tests[test.testName] = test;
                    console.log('adding test');
                });
            };

        // if modules is not an array
        if (typeof modules !== 'object' || !modules.length) {
            module = modules;
            modules = [];
            modules.push(module);
        }
       
        modules.forEach(function (module) {
            if (typeof module === 'string') {
                isDirectory(module, function (err, result) {
                    if (err) {
                        throw err;
                    }

                    if (result) {
                        loadDir(module, addTests);
                    } else {
                        loadfile(module, addTests);
                    }
                });
            } else {
                loadModule(module, addTests);
            }
        });
    },

    //
    // This method runs a test *testName* and calls the callback on the 
    // test result. The callback on the test result upon completion.    
    // testName {string}: The name of the test. must be a name generated by enumTests method
    // context {object}: Test context. Attached to each nodeunit test's 'test' parameter
    // callback {function}: A call back function called upon test completion and receiving the test
    //           result as it's first argument
    runTest: function (testName, callback, context) {
        var test = this.tests[testName],
            testMethod,
            previousTestMethod;

        if (!test || !test.metadata) {
            callback('Failed to run test :"' + testName + '". Not on service');
        }

        testMethod = test.metadata;

        // add context if available        
        if (context) {
            previousTestMethod = testMethod;
            testMethod = function (test) {
                test.context = context;
                previousTestMethod(test);
            };
        }

        reporter.run(testName, testMethod, callback);
    },

    //
    // applies *callback* on an array containing the tests names from testSuite.
    // assuming testSuite's functions are nodeunit style tests    
    // callback {function}: A callback receiving the test names enumaration (array) as its second argument. 
    enumTests: function (callback) {
        var testNames = [],
            key;
        for (key in this.tests) {
            if (this.tests.hasOwnProperty(key)) {
                testNames.push(this.tests[key].testName);
            }
        }

        callback(null, testNames);
    }
};
