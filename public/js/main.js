var parseQueryString = function(queryString) { 
    // Split into key/value pairs
    var queries = queryString.split('&');
 
    // Convert the array of strings into an object
    var params = {}
    for (idx in queries) {
        var temp = queries[idx].split('=');
        params[temp[0]] = temp[1];
    }
 
    return params;
};