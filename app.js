var settings = require ('./settings.json'),
    _ = require('underscore'),
    fs = require('fs'),
    util = require('util'),
    express = require('express'),
    app = express();

var reqId = 1;

app.use(express.compress());
app.use(express.bodyParser());

// post location data
app.post('/location/data', function(req, res) {
    // check request body
    if (_.isArray(req.body)) {
        // write location data to file
        var d = new Date().getTime();
        fs.writeFile('/tmp/trackr-' + (reqId++) + '-' + d + '.json', JSON.stringify(req.body), function(err) {
            if (err) {
                console.log(err.name + ': ' + err.message);
                res.json(400, {status: 'fail', message: err.message});
            }
            console.log('saved.');
            res.json(200, {status:'ok', 'message': 'saved.'});
        });
    }
    else {
        res.json(400, {status: 'fail', message: 'Bad input.'});
    }
});

// send all other requests to 403
app.all('*', function(req, res) {
    res.json(403, {status: 'fail', message: 'Forbidden.'});
});

app.listen(settings.PORT);
