function DemoController($scope, $http, $timeout) {
    var self = this;
    var timerPromise = null;
    self.count = 7; // for caching/local storage
    $scope.count = self.count;
    
    $scope.add = function() {
        self.count = ++$scope.count;
        
        delayApply(function() {
           // send to server
           $http.post('/add-more', {count: self.count});
        });
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
}