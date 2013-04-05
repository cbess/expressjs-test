
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    cons = require('consolidate'),
    less = require('less'),
    fs = require('fs'),
    util = require('util'),
    path = require('path'),
    /*
    The config is used for 'private' config options.
    Config:
            redis_config=object, as shown here: https://docs.appfog.com/services/redis
    */
    config = require('./local.config');

var app = express();
// var is_dev = !process.env.VCAP_APP_PORT; // appfog port

// setup redis
var redis = null,
    redisClient = null;
if (config.redis_config) {
    redis = require('redis');
    var connInfo = config.redis_config['redis-2.2'][0]['credentials'];
    // console.log(connInfo);
    redisClient = redis.createClient(connInfo.port, connInfo.host);
    if (connInfo.password) {
        redisClient.auth(connInfo.password);
    }
}

app.configure(function() {
    app.set('port', process.env.VCAP_APP_PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('redis config', config.redis_config);
    app.set('redis client', redisClient);
    // set .html as the default extension 
    app.set('view engine', 'ejs');
    
    app.use(function(req, res, next) {
        req.redisClient = redisClient;
        next();
    });
    
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(require('stylus').middleware(__dirname + '/public'));
    app.use(express.static(path.join(__dirname, 'public')));
    
    // assign the template engine to files
    app.engine('hbs', cons.handlebars);
    app.engine('ejs', cons.ejs);
});

app.configure('development', function() {
    app.use(express.errorHandler());
    
    // compile `less` to `css`, then send it as the response
    app.get('*.less', function(req, res) {
        var path = util.format('%s/public%s', __dirname, req.url);
        fs.readFile(path, 'utf8', function(err, data) {
            if (err) throw err;
            less.render(data, function(err, css) {
                if (err) throw err;
                res.header('Content-type', "text/css");
                res.send(css);
            });
        });
    });
});

// GET
app.get('/', routes.index);
app.get('/users', user.list);
// ANY
app.all('/add-more', routes.addMore);

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
