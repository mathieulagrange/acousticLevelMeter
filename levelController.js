app.controller("levelController", function($scope, $timeout, $interval) {
    

    var update = function(){
	$scope.level = Math.random();
	$timeout(function(){update()}, 50);
    }

    update();
});
