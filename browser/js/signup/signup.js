app.config(function ($stateProvider) {

    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'js/signup/signup.html',
        controller: 'SignupCtrl'
    });
});

app.controller('SignupCtrl', function($scope, AuthService, $state, $http, $log){
    $scope.newUser = {};
    $scope.submitFunc = function(){
        //maybe put this into a factory/service eventually
        //make this a find or create
        $http({
            method: 'POST',
            url: '/api/users',
            data: $scope.newUser
        }) //based on the return value of the returnOrCreate, either continue or show an error message
        .then(() => {
            return AuthService.login($scope.newUser);
        })
        .then(() => {
            $scope.newUser = {};
            $state.go('home');
        })
        //figure out how to .catch() with $log
    };
});
