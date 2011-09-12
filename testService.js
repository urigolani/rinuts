(function(){	
	// Module dependencies 
		// the node unit test runner api
	var testRunner = require('./nodeUnitWrapper'),
		// the express web server 
		express = require('express'),
		
		// private methods
		formatTest = function(testName, moduleName, domain){	
			var formatedTest = {};
			formatedTest.name = testName;
			formatedTest.module = moduleName;
			formatedTest.url = domain + "\/tests\/" + moduleName + "\/" + testName;
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
	var testService = function(domain){
			this.domain = domain;
			this.init();			
		};
		
	testService.prototype = {		
		///<summary> 
		/// The web service
		///</summary>
		webService: null,
		
		///<summary> 
		/// The test modules loaded
		///</summary>
		testModules: null,
		
		///<summary> 
		/// The domain the web service lives in.
		///</summary>
		domain: null,		
		
		///<summary> 
		/// The formatted tests the test service supports
		///</summary>
		tests: null,
		init: function(domain) {
		///<summary>
		/// Initializes the testService and creates web path handlers for REST api
		///</summary>		
		///<param name="domain" type="String">
		/// Test domain the test service runs in
		///</param>
			this.webService = express.createServer();
			this.testModules = [];	
			this.tests = {};
			var self = this;
			
			//set web path handlers for the webservice			
			this.webService.get('/tests/:testModule/:testName', function(req, res){				
				if(req.params.testModule && 
					req.params.testName &&
					self.tests[req.params.testModule + '_' + req.params.testName]){
					res.json(self.tests[req.params.testModule + '_' + req.params.testName]);
				}
				else{
					res.send('test not found', 404);
				}
			});
			
			this.webService.post('/tests/:testModule/:testName', function(req, res){						
				if(req.params.testModule && 
					req.params.testName && 
					self.tests[req.params.testModule + '_' + req.params.testName]){
					testRunner.runTest(self.testModules[req.params.testModule], req.params.testName, function(testResult){ 						
						res.json(testResult);										
						
					});
				}
				else{					
					res.send('test not found', 404);					
				}
			});
			
			this.webService.get('/tests', function(req, res){  				
				res.json(self.tests);
			});
		},
		///<summary>
		/// Start listening on a port
		///</summary>		
		///<param name="port" type="String">
		/// The port to listen on
		///</param>
		listen: function(port){
			this.webService.listen(port);	
		},
		addModules: function(testModules){
			///<summary>
			/// Adds test modules to the test service tests arsenal.
			///</summary>
			///<param name="testModules" type="Array">
			/// An array of the form [{name: *testName*, module: *module instance*}, ..]
			///</param>
			var self = this;
				
			testModules.forEach(function(testModule){				
				// do not allow adding modules with the same name as existing modules in testModules
				if(testModule.name in self.testModules){
					return;
				}
				
				// add the module
				self.testModules[testModule.name] = testModule.module;
				
				// enumarate the tests in test model and format accordingly. adding tests and access points mappings.
				testRunner.enumTests(self.testModules[testModule.name], function(moduleTests){						
					formatTests(moduleTests, testModule.name, self.domain).forEach(function(test){
						self.tests[testModule.name + '_' + test.name] = test;
					});
				}); 			
			});
		}
	}
	
	module.exports = testService;
}())