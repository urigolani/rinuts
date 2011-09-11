(function(){	
	// Module dependencies 
	var testRunner: require('nodeUnitWrapper'),
		express: require('express'),
		
		// private methods
		formatTest = function(testName, moduleName, domain){	
			var formatedTest = {};
			formatedTest.name = testName;
			formatedTest.url = domain + '\/tests\/' + moduleName + '\/' testName;
			return formatedTest;	
		},
		formatTests = function(testNames, moduleName, domain){
			formatedTests = [];
			testNames.forEach(function(testName){
				formatedTests.push(formatTest(testName, moduleName, domain));
			});
			
			return formatedTests;
		}
		
	// the exported class
	var testService = function(){
			init();			
		};
		
	testService.prototype = {		
		webService: null,
		testModules: null,
		init: function() {
		///<summary>
		/// initializes the testService and creates web path handlers for REST api
		///</summary>		
			this.webService = express.createServer();
			this.testModules [];
			
			// set web path handlers for the webservice			
			webservice.get('/:testModule/:testName')...//TODO complete this
			webService.get('/tests', function(req, res){  
				var tests = [];
				
				//iterate over the test modules and enumarate them
				for(var moduleName in testModules){
					testRunner.enumTests(testModules[moduleName], function(moduleTests){
						tests.concat(formatTests(moduleTests, moduleName, req.domain));   // is this the right way to get request.domain??
					}); 												
				}	
				
				res.json(tests);
			});
		},
		listen: webService.listen,
		addModules: function(testModules){
			///<summary>
			/// Adds test modules to the test service tests arsenal.
			///</summary>
			///<param name="testModules" type="Array">
			/// An array of the form [{name: *testName*, module: *module instance*}, ..]
			///</param>
			testModules.forEach(function(testModule){
				this.testModules[testModule.name] = testModule.module;
			});
		}
	}
	
	module.exports = testService;
}())