var nodeunitWrapper = require('./NodeunitWrapper');
var testSuite = require('./testSuite1');

nodeunitWrapper.enumTests(testSuite, function(tests){	
	tests.forEach(function(test){
		console.log(test);	
	});	
});

nodeunitWrapper.runTest(testSuite, 'test2', function(testResult){	
	console.log(testResult);	
});
