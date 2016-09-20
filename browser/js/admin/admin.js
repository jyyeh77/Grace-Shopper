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
    $scope.displayOrder = false;


    //order management
    $scope.viewAllOrders = function(){
        AdminFactory.viewAllOrders()
        .then(allOrders => {
            $scope.allOrders = allOrders;
            $scope.showOM = !$scope.showOM ? true: false;
            // hides single order page
            if ($scope.displayOrder) $scope.displayOrder = false;
        })
    }

    $scope.showSingleOrder = function (orderId) {
        OrderFactory.fetchOrder(orderId)
          .then(order => {
            $scope.showOM = false;
            $scope.displayOrder = true;
            $scope.order = order;
            console.log("SINGLE ORDER: ", $scope.order);
          })
    }

    //user management
    $scope.setAdmin = AdminFactory.changeAdminStatus;
    $scope.deleteUser = AdminFactory.deleteUser;
    $scope.resetPassword = AdminFactory.resetPassword;


});
