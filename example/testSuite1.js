// Test File

exports.test1 = function (test){
    test.ok(true, 'Test should pass');    
    test.done();    
};

exports.test2 = function (test){
    test.fail(true, 'Test should fail');    
    test.done();    
};