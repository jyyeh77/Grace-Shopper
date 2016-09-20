app.config(function ($stateProvider) {

    $stateProvider.state('admin', {
        data: {
            authenticate: true
        },
        url: '/admin',
        controller: 'AdminController',
        templateUrl: 'js/admin/admin.html',
        // resolve: {
        //     loggedInUser: function(AuthService){
        //         return AuthService.getLoggedInUser();
        //     }
        // }
    });

});

app.controller('AdminController', function ($scope, AdminFactory, OrderFactory) {

    $scope.greeting = 'Welcome to the admin page';
    //$scope.currentUser = loggedInUser; // might be redundant
    $scope.showOM = false;
    $scope.showPM = false;
    $scope.showUM = false;
    $scope.allOrders = [];

    //order management
    $scope.viewAllOrders = function(){

        AdminFactory.viewAllOrders()
        .then(allOrders => {
            allOrders.forEach(order => {
                order.total = OrderFactory.getOrderCost(order)
            });
            $scope.allOrders = allOrders
            
        })
       
    }


    //user management
    $scope.setAdmin = AdminFactory.changeAdminStatus;
    $scope.deleteUser = AdminFactory.deleteUser;
    $scope.resetPassword = AdminFactory.resetPassword;


});
