
# rinuts
  
  Exposes nodeunit based tests through a RESTful api, allowing to remotely query for the urls of supported tests and to activate them, receiving a detailed test run summary.
    
  built on [node](http://nodejs.org) and [express](http://github.com/visionmedia/express).

## Installation

    Install with [npm](http://github.com/isaacs/npm):
    
        $ npm install rinuts

## Usage

### Starting the service:
    
    // Assuming testSuite1 and testSuite2 are two nodeunit based test modules, Creating an endpoint to expose the included modules is done as follows:
    
    var services = {},
    testService = null;
    
    services.rinuts = require('rinuts');
    testService = new services.rinuts();

    // add test modules
    testService.addModules([{name: 'Suite1', module: require('./testSuite1')}, {name: 'Suite2', module: require('./testSuite1')}]);

    // start listening
    testService.listen('9999');

### Service API:
    
    * addModule(module):
        Adds a test module to the service to be exposed.
        [Argument] module - a pair of 'name , module'. has the form of {name: *moduleName*, module: *theModule*}  
    
    * addModules(modules):
        Adds test modules to the service to be exposed.
        [Argument] modules - array of 'name , module' pairs. has the form of [{name: *moduleName*, module: *theModule*},..]  
       
    * listen(port)
        Starts listening for requests on port.
        [Argument] port - string specifying the port number to listen on.
     
    
### HTTP exposed API:

    *	GET /tests : JSON response with a list of the tests exposed. Each test includes it's unique name and a POST URL which can be used to execute it. The list structure is as follows:
            {
                "*moduleName_testName*": {
                    "name": "*testName*",
                    "module":"*moduleName*",
                    "url":"/tests/*moduleName*/*testName*"
                    }
                ...
            }

    *	GET /tests/:testName : Returns an individual entry from the list above. has the form of:
			{
				"name": "*testName*",
				"module": "*moduleName*",
				"url": "/tests/*moduleName*/*testName*"}
    
    *	POST /tests/:testName : Executes the individual test and returns the test run summary, including stdout/err capture, in the following structure:            
            {
                "name": *testName*,
                "duration": *in milliseconds*,
                "state": *true|false*,
                "assertions": [{  
                                "method": *ok | fail etc..*
                                "success": *true|false*,             
                                "message": *assertion message*, // included only for failed tests
                                "stack": *stack trace*, // included only for failed tests					
                            }...
                            ]		
            }
