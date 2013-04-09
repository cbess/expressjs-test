var _ = require('underscore');
// fake global database object
var gData = {};

// homepage
exports.index = function(req, res) {
    var context = { 
        title: 'Demo', 
        body: 'body text',
        count: 7
    };
    
    // now render index
    res.render('index', context);
};

/*
 * Redis backend
 */

// redis
exports.redisTestIndex = function(req, res) {
    // grab redis value before rendering
    req.redisClient.get('count', function(req, reply) {   
        var context = { 
            title: 'Demo', 
            body: 'body text',
            count: reply.toString()
        };
        
        // now render index
        res.render('index', context);
    });
};

// handles addMore requests
exports.addMore = function(req, res) {
    // console.log(req.body);
    req.redisClient.set('count', req.body.count);
    res.send(200);
};

/*
 * Non-redis backend
 */
function safeKey(key) { return _.isString(key) ? key : 'n/a' }

exports.itemsIndex = function(req, res) {
    var key = safeKey(req.query.key);
    var context = {
        title: 'Items',
        items: gData[key],
        'key': key
    };
    res.render('items-index', context);
};

// request: ?key=string
// response: data items
exports.items = function(req, res) {
    var info = req.query;
    var data = gData[safeKey(info.key)];
    if (!_.isObject(data))
        data = [];
    
    console.log('query: %j', req.query);
    console.log('data: %j', data);
    
    res.send(data);
};

// request: data=[{name: string}, ...]&key=string
// response: 200
exports.addItems = function(req, res) {
    var data = req.body;
    var key = safeKey(data.key);
    
    if (!_.isObject(gData[key]))
        gData[key] = [];
    
    // add the items
    _.forEach(data.data, function(item) {
        gData[key].push(item);
    });
    
    console.log('data: %j', data);
    console.log('global data: %j', gData);
    
    res.send(200);
};
