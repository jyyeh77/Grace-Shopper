app.config(function ($stateProvider) {

  $stateProvider.state('admin', {
    data: {
      authenticate: true
    },
    url: '/admin',
    controller: 'AdminController',
    templateUrl: 'js/admin/admin.html'
 
  });

});

app.controller('AdminController', function ($scope, AdminFactory, OrderFactory, Product) {

  $scope.greeting = 'Welcome to the admin page';
  //$scope.currentUser = loggedInUser; // might be redundant
  $scope.showOM = false;
  $scope.showPM = false;
  $scope.showUM = false;
  $scope.displayOrder = false;


  /* ORDER MANAGEMENT */

  $scope.orderStatuses = [
    {type: 'Pending'},
    {type: 'Completed'},
    {type: 'Shipped'},
    {type: 'Cancelled'}
  ]

  // gets all orders and displays in table
  $scope.viewAllOrders = function () {
    AdminFactory.viewAllOrders()
      .then(allOrders => {
        $scope.allOrders = allOrders;
        $scope.showOM = !$scope.showOM;
        // hides single order page
        if ($scope.displayOrder) $scope.displayOrder = false;
      })
  }

  // shows individual orders upon clicking order ID in order table
  $scope.showSingleOrder = function (orderId) {
    OrderFactory.fetchOrder(orderId)
      .then(order => {
        $scope.showOM = false;
        $scope.displayOrder = true;
        $scope.order = order;
      })
  }

  // resets status filter
  $scope.clearOrderFilter = function () {
   $scope.setStatus = {};
  }

  /* PRODUCT MANAGEMENT */
  $scope.product = {};
  $scope.createProduct = Product.createProduct;
  $scope.createProduct = Product.createCategory;

  /* USER MANAGEMENT */
  $scope.setAdmin = AdminFactory.changeAdminStatus;
  $scope.deleteUser = AdminFactory.deleteUser;
  $scope.resetPassword = AdminFactory.resetPassword;
});
