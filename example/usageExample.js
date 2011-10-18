var path = require('path'),
    rinuts = require('./../index.js'),
    driver = require('./mockRinutsDriver.js');

var mockdriver = new driver({
    test1: {
        name: 'test1',
        method: function () {
            return true;
        }
    }
});

var rinutsService = new rinuts(mockdriver);
rinutsService.listen(9999);








