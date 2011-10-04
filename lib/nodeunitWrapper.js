var testRunner = require('./singleTestReporter');
    
//
// This method runs a test *testName* from *testModule* and calls the callback on the 
// test result. The callback on the test result upon completion.
// testModule {object}: The test module. All function in this object must be nodeunit tests.
// testName {string}: The name of the test
// callback {function}: A call back function called upon test completion and receiving the test
//           reasult as it's first argument
exports.runTest = function(testModule, testName, callback) {    
    var test = testModule[testName];    
    if(test && typeof test === 'function'){        
        testRunner.run(testName, test, callback);
    }
}

//
// applies *callback* on an array containing the tests names from testSuite.
// assuming testSuite's functions are nodeunit style tests
// testSuite {object}: The test suite;
// callback {function}: A callback receiving the test enumaration (array) as its first argument
exports.enumTests = function(testSuite, callback){
    var tests = [];    
    
    for(var test in testSuite){        
        // allow functions only assuming all functions in testSuite are tests
        
        if(typeof testSuite[test] === 'function')
        tests.push(test);        
    }
    
    callback(tests);
}

