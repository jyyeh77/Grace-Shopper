app.config(function ($stateProvider) {

    $stateProvider.state('account', {
        data: {
            authenticate: true
        },
        url: '/account',
        controller: 'AccountController',
        templateUrl: 'js/account/account.html',
        resolve: {
            loggedInUser: function(AuthService){
                return AuthService.getLoggedInUser();
            }
        }
    });

});

app.controller('AccountController', function ($scope, loggedInUser, AuthService) {

    $scope.greeting = 'Welcome to your account page';
    $scope.currentUser = loggedInUser; // might be redundant
    $scope.changeEmail = AuthService.changeEmail;
    //$scope.changeEmail = 
    //AuthService.changeEmail
    //AuthService.signup

});
