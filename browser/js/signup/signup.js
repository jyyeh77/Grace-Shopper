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
        

        // $http({
        //     method: 'POST',
        //     url: '/api/users',
        //     data: $scope.newUser
        // }) //based on the return value of the findOrCreate, either continue or show an error message

        //based on the return value of the findOrCreate, either continue or show an error message

        AuthService.signup($scope.newUser)
        .then(result => console.log('will probably be a user',result))

        // .then(() => {
        //     console.log('trying to log in')
        //     return AuthService.login($scope.newUser);
        // })
        // .then(() => {
        //     $scope.newUser = {};
        //     $state.go('home');
        // })
        //figure out how to .catch() with $log
    };
});
