
// homepage
exports.index = function(req, res) {
    // grab redis value before rendering
    req.redisClient.get('count', function(req, reply) {   
        var context = { 
            title: 'Express', 
            body: 'body text',
            count: reply.toString()
        };
        
        // now render index
        res.render('index', context);
    });
};

// handles addMore requests
exports.addMore = function(req, res) {
    req.redisClient.set('count', req.body.count);
    res.send(200);
};