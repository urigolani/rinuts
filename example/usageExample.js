var path = require('path'),
    rinuts = require('./../index.js');

//rinuts.listen([path.resolve('testFold'), path.resolve('testSuite1.js')], 9999);
rinuts.listen(require('./testSuite1'), 9999);








