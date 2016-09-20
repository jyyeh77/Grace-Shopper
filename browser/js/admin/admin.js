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
});

app.controller('AdminController', function ($scope, AdminFactory, OrderFactory, Product) {

  $scope.greeting = 'Welcome to the admin page';
  //$scope.currentUser = loggedInUser; // might be redundant
  $scope.showOM = false;
  $scope.showPM = false;
  $scope.showUM = false;
  $scope.displayOrder = false;
  $scope.showProduct = false;

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
      .catch(err => {
        alert("ERROR: ", err.message);
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
        order.total = OrderFactory.getOrderCost(order);
        $scope.order = order;
      })
  }

  // resets status filter
  $scope.clearOrderFilter = function () {
   $scope.setStatus = {};
  }

  /* PRODUCT MANAGEMENT */
  $scope.product = {};
  $scope.category = {};
  $scope.productAvailabilities = [
    {type: 'In Stock'},
    {type: 'Out of Stock'},
  ];
  $scope.metaCategories = [
    {type: 'Electronics'},
    {type: 'Vehicles'},
  ]
  $scope.createProduct = Product.createProduct;
  $scope.createCategory = Product.createCategory;

  /* USER MANAGEMENT */

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

  /* PRODUCT MANAGEMENT */
  Product.fetchAll()
    .then(allProducts => {
      $scope.products = allProducts;
    })

  $scope.showSingleProduct = function (product) {
      Product.fetchById(product.id)
        .then(foundProduct => {
            $scope.product = foundProduct;
            $scope.showProduct = true;
          })
  }

  /* USER MANAGEMENT */
  $scope.setAdmin = AdminFactory.changeAdminStatus;
  $scope.deleteUser = AdminFactory.deleteUser;
  $scope.resetPassword = AdminFactory.resetPassword;

});

