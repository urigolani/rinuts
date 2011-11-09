
# rinuts
  
  A service which exposes tests through a RESTful api. Allows for remote querying and running tests on the service, by using http requests", as well as retrieving a detailed run information
    
  built on [node](http://nodejs.org) and [express](http://github.com/visionmedia/express) 

## Installation

    Install with [npm](http://github.com/isaacs/npm):
    
        $ npm install rinuts

## Usage

### Starting the service:
        
    var path = require('path'),
        rinuts = require('rinuts'),
        someDriver = require('rinuts-someDriver'),
        service;
        
        // what ever api the driver has to load tests
        someDriver.addTests(*TESTS*);
                
        service = new rinuts(someDriver);
        service.listen(3333);

### Service API:
           
    * *ctor*  (driver, context)
        Constructor. Loads a driver which implementes 'enumTests' and 'runTest'.
        [Argument] driver - The driver        
		[Argument] context - (optional) An object being the context of each test run.         
    
### HTTP exposed API:

    *	GET /tests : JSON response with a list of the tests exposed. Each test includes it's unique name and a POST URL which can be used to execute it. The list structure is as follows:
            {
                "*testName*": {
                    "name": "*testName*",                    
                    "url":"/tests/*testName*"
                    }
                ...
            }

    *	GET /tests/:testName : Returns an individual entry from the list above. has the form of:
			{
				"name": "*testName*",				
				"url": "/tests/*testName*"}
    
    *	POST /tests/:testName : Executes the individual test and returns the test run summary, in the following structure (can be expanded by the driver):            
            {
                "name": *testName*,                
                "state": *true|false*                
            }
			
		Adding context to the request(Optional):		
			HTTP-Headers: "Content-Type: application/json"
			HTTP-Body: {"context": *whatEver*}" - a JSON notated object
		
		note - added context will override context supplied to the *ctor* of rinuts.
