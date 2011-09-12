var services = {},
    testService = null;
    
services.testService = require('./testService');
testService = new services.testService();

// add test module
testService.addModules([{name: 'Suite1', module: require('./testSuite1')}, {name: 'Suite2', module: require('./testSuite1')}]);

// start listening
testService.listen(process.argv[3]);








