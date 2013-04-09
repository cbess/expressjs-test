function DemoController($scope, $http, $timeout) {
    var self = this;
    var timerPromise = null;
    self.count = 7; // for caching/local storage
    $scope.count = self.count;
    $scope.items = [];
    $scope.itemName = '';
    $scope.when = {'0': 'No items', 'one': 'One item', 'other': '{} items'};
    
    // load initial data
    function loadItems() {
        $http.get('/items', {params: {key: window.query.key}}).success(function(data) {
            $scope.items = data;
        });
    }
    
    // watch for connectivity changes
    window.addEventListener("offline", function() {
        self.updateOnlineStatus(false, true);
    }, false);
    
    window.addEventListener("online", function() {
        self.updateOnlineStatus(true, true);
    }, false);
    
    this.updateOnlineStatus = function(online, apply) {
        if (online)
        {            
            $scope.connectionMessage = 'Online.';
            $scope.connectedCssClass = 'online';
        }
        else
        {
            $scope.connectionMessage = 'You are now offline.';
            $scope.connectedCssClass = 'offline';
        }
        
        if (apply)
            $scope.$apply();
    };
    
    $scope.add = function() {
        self.count = ++$scope.count;
        
        delayApply(function() {
           // send to server
           $http.post('/add-more', {count: self.count});
        });
    };
    
    $scope.addItem = function() {
        if (!$scope.itemName)
            return;
            
        var key = window.query.key;
        var item = {name: $scope.itemName};
        
        // create the item to add, then send to the server
        $scope.items.push(item);
        $scope.itemName = '';
        
        // send to the server
        $http.post('/add-items', {data: [item], 'key': key});
    };
    
    function delayApply(callback) {
        if (timerPromise)
            $timeout.cancel(timerPromise);
        
        // delay exec to prevent dogpiling of apply calls, which may
        // throw an exception
        timerPromise = $timeout(function() {
            $scope.$apply(callback);
        }, 1000, false);
    }
    
    loadItems();
    self.updateOnlineStatus(true);
}

query = parseQueryString(location.search.substring(1));
