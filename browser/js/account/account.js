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

    // fetch all orders for a user regardless of order status
    OrderFactory.fetchAllUserOrders(loggedInUser)
      .then(orders => {
        orders.forEach(order => {
          order.total = OrderFactory.getOrderCost(order);
        })
        $scope.userOrders = orders;
      })
});
