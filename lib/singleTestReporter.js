/*!
 * Nodeunit
 * This reporter performs a single test exection of a given test, and stores the result in a formatted 
 * 'result' object that has the following form:
	{
		name: *testName*,
		duration: *in milliseconds*,
		state: *true|false*,
		assertions: [{  
                        method: *ok | fail etc..*
                        success: *true|false*,             
						message: *assertion message*, // included only for failed tests
						stack: *stack trace*, // included only for failed tests					
					}...
					]		
	}
 */

//
// Module dependencies
var nodeunit = require('../node_modules/nodeunit/lib/nodeunit'),
    utils = require('../node_modules/nodeunit/lib/utils'),
    AssertionError = require('../node_modules/nodeunit/lib/assert').AssertionError;	

//
// Run all tests within each module, accumulating the results in the local testResult object.
// testName {string} - the name of the test
// testMethod {function} - the test method
// testEnd {function}- callback that get the test result as a parameter and called when the test is done
exports.run = function (testName, testMethod, testEnd) {
	var testResult = {};

    nodeunit.runTest(testName, testMethod, {        
        testDone: function (name, assertions) {
            var formattedAssertion;			
			
			testResult.duration = assertions.duration;			
            testResult.success = !assertions.failures() ? true : false;
			testResult.assertions = [];
			assertions.forEach(function (a) {
				formattedAssertion = {};				
				// add test method, e.g, ok | fail etc..							
				formattedAssertion.method = a.method;
				formattedAssertion.success = true;
				if (a.failed()) {					
                    formattedAssertion.success = false;
					a = utils.betterErrors(a);		
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
		testEnd(null, testResult);
	});  // callback function to be called when the test is done.
};
