app.config(function ($stateProvider) {

    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'js/signup/signup.html',
        controller: 'SignupCtrl'
    });
});

app.controller('SignupCtrl', function($scope, AuthService, $state){
    $scope.newUser = {};
    $scope.error = null;
    $scope.submitFunc = function(){
        AuthService.signup($scope.newUser)
        .catch(err => {$scope.error = err.message})
        .then(() => {
          AuthService.login($scope.newUser)
        })
        .then(() => $state.go('home'));
    };
});
