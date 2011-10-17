var rinuts = require('./../lib/webTestService'),
    nodeunitDriver = require('./../lib/nodeunitDriver');    
    
exports.listen = function (modules, port) {
    var nuDriverinstance = new nodeunitDriver(modules),
        service = new rinuts(nuDriverinstance);
    service.listen(port);
};