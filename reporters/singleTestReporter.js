/*!
 * Nodeunit
 * MIT Licensed
 * This reporter performs a single test exection of a given test, and stores the result in a formatted 
 * 'result' object that has the following form:
	{
		name: *testName*,
		duration: *in milliseconds*,
		state: *true|false*,
		assertions: [{  
						message: *assertion message*,
						stack: *stack trace*,						
					}...
					]		
	}
 */

/**
 * Module dependencies
 */

var nodeunit = require('../node_modules/nodeunit/lib/nodeunit'),
    utils = require('../node_modules/nodeunit/lib/utils'),
    AssertionError = require('../node_modules/nodeunit/lib/assert').AssertionError;	

/**
 * Run all tests within each module, accumulating the results in the local testResult object.
 *
 * @param {string} testName - the name of the test
 * @param {function} testMethod - the test method
 * @param {function} testEnd - callback that get the test result as a parameter and called when the test is done
 * @api public
 */

exports.run = function (testName, testMethod, testEnd) {
	var testResult = {};

    nodeunit.runTest(testName, testMethod, {        
        testDone: function (name, assertions) {
            var formattedAssertion;			
			
			testResult.duration = assertions.duration;
			// TODO --ADD ALL ASSERTIONS			
            testResult.success = !assertions.failures() ? true : false;
			testResult.assertions = [];
			assertions.forEach(function (a) {
				formattedAssertion = {};				
				// add test method, e.g, ok | fail etc..							
				formattedAssertion.method = a.method;
				
				if (a.failed()) {					
					a = utils.betterErrors(a);		// FIGURE THIS OUT - IS IT NECESSARY?
					if (a.error){
						if(a.error instanceof AssertionError && a.message) {
							formattedAssertion.message = a.message;
						}							
						
						// add stack trace if available
						if(a.error.stack){
							formattedAssertion.stack = a.error.stack;						
						}
					}
				}			
				
				testResult.assertions.push(formattedAssertion);				
			});
        },
        testStart: function(name) {
            testResult.name = name.toString();			
        }
    },
	function(){
		testEnd(testResult);
	});  // callback function to be called when the test is done.
};
