app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', function ($scope, AuthService, $state, CartFactory) {

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function (loginInfo) {

        $scope.error = null;
        // empties cart of not logged-in user prior to LOGIN
        return CartFactory.emptyCart()
          .then(() => {
            AuthService.login(loginInfo).then(function () {
              $state.go('home');
            }).catch(function () {
              $scope.error = 'Invalid login credentials.';
            });
          })
    };

});
