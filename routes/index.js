// var cons = require('consolidate');

// homepage
exports.index = function(req, res) {
    res.render('index', { title: 'Express', body: 'body text' });
};