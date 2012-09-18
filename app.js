
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
    path = require('path');

var app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  // set .html as the default extension 
  app.set('view engine', 'hbs');
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
});

app.configure('development', function(){
    app.use(express.errorHandler());

    // compile `less` to `css`, then send it as the response
    app.get("*.less", function(req, res) {
        var path = util.format('%s/public%s', __dirname, req.url);
        fs.readFile(path, "utf8", function(err, data) {
            if (err) throw err;
            less.render(data, function(err, css) {
                if (err) throw err;
                res.header("Content-type", "text/css");
                res.send(css);
            });
        });
    });
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
