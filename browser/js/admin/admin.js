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


app.controller('AdminController', function ($scope, $location, $anchorScroll, AdminFactory, OrderFactory, Product, UserFactory) {


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

  // to display alerts after product update
  $scope.productSuccess = false;

  /* USER MANAGEMENT */

  //get list of all users
  function getUsers() {
    UserFactory.getAll()
      .then(users => {
        $scope.userList = users;
      })
  }

  getUsers();

  //watch for changes to user list, e.g. admin status or deletion
  $scope.$watch('userList', (newUserList) => {
    $scope.userList = newUserList;
  })

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
    {type: 'Currently Unavailable'},
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
  $scope.product = {};
  $scope.category = {};
  $scope.productAvailabilities = [
    {type: 'In Stock'},
    {type: 'Currently Unavailable'},
  ];
  $scope.metaCategories = [
    {type: 'Electronics'},
    {type: 'Vehicles'},
  ];
  $scope.createProduct = function (product) {
    Product.createProduct(product);
    $scope.product = {};
  }
  $scope.createCategory = function () {
    Product.createCategory($scope.category);
    $scope.category = {};
  };

  $scope.addProductCategory = Product.addProductCategory;

  // EDIT EXISTING PRODUCTS

  // scrolls user to top upon selecting single item to edit
  var goToTop = function () {
    $location.hash('tabs');
    $anchorScroll();
  }

  let getAllProducts = function () {
    Product.fetchAll()
      .then(allProducts => {
        $scope.products = allProducts;
      })
  }
  getAllProducts();

  $scope.showSingleProduct = function (product) {
    Product.fetchById(product.id)
      .then(foundProduct => {
        $scope.product = foundProduct;
        $scope.showProduct = true;
        goToTop();
      })
  }

  $scope.backToProductPanel = function () {
    $scope.showProduct = false;
    getAllProducts();
  }


  // FILE UPLOAD

  // ng-pattern on image url input uses this to check for valid image link
  $scope.regex = /\.(gif|jpg|jpeg|tiff|png)$/i;

  // update image for product!
  $scope.submitImage = function (imageUrl) {
    return Product.updateProduct($scope.product, {imageUrl: imageUrl})
      .then(updatedProduct => {
        $scope.product = updatedProduct;
      } );
  }

  // change product name
  $scope.submitDetails = function (changedProduct) {
    return Product.updateProduct($scope.product, changedProduct)
      .then(updatedProduct => {
        $scope.product = updatedProduct;
        $scope.productSuccess = true;
      })
  }


  //user management
  $scope.setAdmin = function (email) {
    AdminFactory.changeAdminStatus(email)
      .then(() => {
        $scope.success = true;
        getUsers();
      })

  }

  $scope.deleteUser = function (email) {
    AdminFactory.deleteUser(email)
      .then(() => {
        $scope.success = true;
        $scope.userEmail = '';
        getUsers();
      })
  }

  $scope.resetPassword = function (email) {
    AdminFactory.resetPassword(email)
      .then(() => {
        $scope.success = true;
        getUsers();
      })
  }

});

