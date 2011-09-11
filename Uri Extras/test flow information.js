
    async.forEachSeries = function (arr, iterator, callback) {
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            iterator(arr[completed], function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed === arr.length) {
                        callback();
                    }
                    else {
                        iterate();
                    }
                }
            });
        };
        iterate();
    };
	
	
	
    var _concat = function (eachfn, arr, fn, callback) {
        var r = [];
        eachfn(arr, function (x, cb) { //the function here will act as the iterator function above
            fn(x, function (err, y) {	//fn is the function(key, cb) in test. the function(err, y) will be called when the test ends
                r = r.concat(y || []);
                cb(err);				//  cb here is the function (err) in lines 8-23 incharge of contuinuing the iteration and handeling the test response
            });
        }, function (err) {
            callback(err, r);
        });
    };