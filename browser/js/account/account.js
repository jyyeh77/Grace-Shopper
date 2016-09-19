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

app.controller('AccountController', function ($scope, loggedInUser, OrderFactory) {

    $scope.currentUser = loggedInUser; // might be redundant

    OrderFactory.fetchAllUserOrders(loggedInUser)
      .then(orders => {
        $scope.userOrders = orders;
        console.log($scope.userOrders);
      })

});
