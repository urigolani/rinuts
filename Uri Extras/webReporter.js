/*!
 * Nodeunit
 * Copyright (c) 2010 Caolan McMahon
 * MIT Licensed
 * This reporter is 90% based on the default reporter
 * and was ripped from it. modifications include removing the prints to console.log 
 * instead creating a hash of test results, and receiving a callback(testResults) for the run method
 * to be executed after the last test ends. 
 */

/**
 * Module dependencies
 */

var nodeunit = require('../nodeunit'),
    utils = require('../utils'),
    fs = require('fs'),
    track = require('../track'),
    path = require('path');
    AssertionError = require('../assert').AssertionError;	

/**
 * Reporter info string
 */

exports.info = "Default tests reporter";


/**
 * Run all tests within each module, accumulating the results in the local testResults object.
 *
 * @param {Array} files
 * @param {function} testEnd 
 * @api public
 */

exports.run = function (files, options, testEnd) {
	var testResults = {};		
	
    if (!options) {
        // load default options
        var content = fs.readFileSync(
            __dirname + '/../../bin/nodeunit.json', 'utf8'
        );
        options = JSON.parse(content);
    }
    
    var assertion_message = function (str) {
        return options.assertion_prefix + str + options.assertion_suffix;
    };

    var start = new Date().getTime();
    var paths = files.map(function (p) {
        return path.join(process.cwd(), p);
    });
    var tracker = track.createTracker(function (tracker) {
        if (tracker.unfinished()) {
            console.log('');
            console.log(
                'FAILURES: Undone tests (or their setups/teardowns): '
            );
            var names = tracker.names();
            for (var i = 0; i < names.length; i += 1) {
                console.log('- ' + names[i]);
            }
            console.log('');
            console.log('To fix this, make sure all tests call test.done()');
            process.reallyExit(tracker.unfinished());
        }
    });

    nodeunit.runFiles(paths, {
        testspec: options.testspec,        
        testDone: function (name, assertions) {
            tracker.remove(name);

            if (!assertions.failures()) {
                testResults[name] += '[PASS] |' + name;
            }
            else {
                testResults[name] += '[FAIL] |' + name + '\n';				
                assertions.forEach(function (a) {
                    if (a.failed()) {
                        a = utils.betterErrors(a);
                        if (a.error instanceof AssertionError && a.message) {
                            testResults[name] += 
                                'Assertion Message: ' +
                                assertion_message(a.message);
                            
                        }
                        testResults[name] += a.error.stack + '\n';
                    }
                });
            }
        },
        done: function (assertions, end) {
            var end = end || new Date().getTime();
            var duration = end - start;
            testResults.summary = '';
			debugger;
			if (assertions.failures()) {
                testResults.summary +=
                    '\n' + 'FAILURES: ' + assertions.failures() +
                    '/' + assertions.length + ' assertions failed (' +
                    assertions.duration + 'ms)';
                
            }
            else {
                testResults.summary +=
                   '\n' + 'OK: ' + assertions.length +
                   ' assertions (' + assertions.duration + 'ms)';                
            }
			
			if(testEnd){
				testEnd(testResults);
			}
        },
        testStart: function(name) {
            testResults[name] = ''; // initialize test 'name' result field
			tracker.put(name);
        }
    });
};
