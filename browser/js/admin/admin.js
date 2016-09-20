app.config(function ($stateProvider) {

  $stateProvider
    .state('admin', {
    data: {
      authenticate: true
    },
    url: '/admin',
    controller: 'AdminController',
    templateUrl: 'js/admin/admin.html'
  })
    .state('admin.products', {
      templateUrl: 'js/admin/adminProducts.html',
      controller: 'AdminProductsController'
    })


});

app.controller('AdminController', function ($scope, AdminFactory, OrderFactory) {

  $scope.greeting = 'Welcome to the admin page';
  //$scope.currentUser = loggedInUser; // might be redundant
  $scope.showOM = false;
  $scope.showPM = false;
  $scope.showUM = false;
  $scope.displayOrder = false;

  //to display alerts after user update
  $scope.success = false;
  $scope.warning = false;



  /* ORDER MANAGEMENT */

  $scope.orderStatuses = [
    {type: 'Pending'},
    {type: 'Completed'},
    {type: 'Shipped'},
    {type: 'Cancelled'}
  ]

  // gets all orders and displays in table
  var showOrders = function () {
    AdminFactory.viewAllOrders()
      .then(allOrders => {
        $scope.allOrders = allOrders;
        $scope.showOM = true;
        // hides single order page
        if ($scope.displayOrder) $scope.displayOrder = false;
      })
  }
  showOrders();

  // used in view all orders button on single order page to return to all orders page
  $scope.returnToAllOrders = function () {
    $scope.showOM = true;
    $scope.displayOrder = false;
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

  // changes order status when check button is clicked
  $scope.confirmStatus = function (orderId, changedStatus) {
    let newStatus = changedStatus.type.toString();
    AdminFactory.setOrderStatus(orderId, newStatus)
      .then(() => {
        showOrders();
      })
      .catch(err => {
        alert('ERROR: ', err.message)
      })
  }

  // updates allOrders as individual order statuses are being changed
  $scope.$watch('allOrders', (newOrders) => {
    $scope.allOrders = newOrders;
  })


  //user management
  $scope.setAdmin = AdminFactory.changeAdminStatus
  $scope.deleteUser = AdminFactory.deleteUser;
  $scope.resetPassword = AdminFactory.resetPassword;


});
