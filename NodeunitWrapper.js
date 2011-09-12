var testRunner = require('./reporters/singleTestReporter');
	
exports.runTest = function(testModule, testName, callback) {
	/// <summary>
	///	This method runs a test *testName* from *testModule* and calls the callback on the 
	/// test result. The callback on the test result upon completion.
	/// </summary>
	/// <param name="testModule" type="Object">
	///  The test module. All function in this object must be nodeunit tests.
	/// </param>
	/// <param name="testName" type="String">
	///  The name of the test
	/// </param>
	/// <param name="callback" type="Function">
	///	 A call back function called upon test completion and receiving the test
	///	 reasult as it's first argument
	/// </param>
	
	var test = testModule[testName];	
	if(test && typeof test === 'function'){		
		testRunner.run(testName, test, callback);
	}
}

exports.enumTests = function(testSuite, callback){
	/// <summary>
	///	applies *callback* on an array containing the tests names from testSuite.
	/// assuming testSuite's functions are nodeunit style tests
	/// </summary>	
	/// <param name="testSuite" type="Object">
	///  The test suite
	/// </param>
	/// <param name="callback" type="function">
	/// the callback
	/// </param>	
	
	var tests = [];	
	
	for(var test in testSuite){		
		// allow functions only assuming all functions in testSuite are tests
		
		if(typeof testSuite[test] === 'function')
		tests.push(test);		
	}
	
	callback(tests);
}

