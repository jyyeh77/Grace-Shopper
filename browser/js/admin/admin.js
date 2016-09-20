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

app.controller('AdminController', function ($scope, AdminFactory) {

    $scope.greeting = 'Welcome to the admin page';
    //$scope.currentUser = loggedInUser; // might be redundant
    $scope.showOM = false;
    $scope.showPM = false;
    $scope.showUM = false;
    $scope.allOrders = [];

    // Remember to include functionality to edit the products either
    // on their page or in a list. -KHJH

    // For editting the orders, it's probably easier to show all the
    // orders without the button, if you do want to use the button
    // make sure it shows all the orders. - KHJH

    //order management
    $scope.viewAllOrders = function(){
        AdminFactory.viewAllOrders()
        .then(allOrders => {
            $scope.allOrders = allOrders
        })
    }

    // For editting the users, it's probably easier to show all the
    // users instead of having to search by email - KHJH

    //user management
    $scope.setAdmin = AdminFactory.changeAdminStatus;
    $scope.deleteUser = AdminFactory.deleteUser;
    $scope.resetPassword = AdminFactory.resetPassword;


});
