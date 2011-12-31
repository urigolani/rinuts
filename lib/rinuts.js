//jslint igonres
/*globals module, require, console */

// the express web server
var express = require('express'),

// private methods:

    formatTest = function (key, test) {
        var formattedTest = {};
        formattedTest.name = test.testName;
        formattedTest.url = "/tests/" + key;
        return formattedTest;
    },
    formatTests = function (tests) {
        var formattedTests = [];

        for (var k in tests) {
            formattedTests.push(formatTest(k, tests[k]));
        }

        return formattedTests;
    };

// the exported class
var testService = function (driver, context) {
    this.init(driver, context);            
};

//
// expose testService
module.exports = testService;

testService.prototype = {
    //
    // Initializes the testService and creates web path handlers for REST api    
    init: function (driver, context) {
        var self = this;

        // the driver for the tests
        this.driver = driver;

        if (context) {
            this.context = context;
        }

        // The web service    
        this.webService = express.createServer();
        // add a body parser
        this.webService.use(express.bodyParser());

        //
        // web api:   
	
        this.webService.get('/', function (req, res) {
            res.send('rinuts test service');
        });
		
        this.webService.get('/tests/:testName', function (req, res) {            
            res.json(formatTest(req.params.testName));                 
        });

        this.webService.post('/tests/:testName', function (req, res) {
            // pull the context from the request or attach the default context if exists
            var context = req.body && req.body.context ? req.body.context : self.context;
            self.driver.runTest(
                req.params.testName,
                function (err, testResult) {
                    if (err) {
                        res.send(err, 500);
                    } else {
                        res.json(testResult);
                    }
                },
                context
            );
            
        });

        this.webService.get('/tests', function (req, res) {
            res.json(formatTests(self.driver.tests));
        });
    },
    
    //
    // Start listening on a port    
    // port {number}: The port to listen on
    listen: function (port) {
        this.webService.listen(port);
        console.log('listening to port ' + port);
    }    
};
