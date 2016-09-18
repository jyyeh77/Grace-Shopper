app.config(function ($stateProvider) {

  // Register our category state.
  $stateProvider.state('cart', {
    url: '/cart',
    controller: 'CartController',
    templateUrl: 'js/cart/cart.html',
    resolve: {
      // itemsInCat: function(Category, $stateParams){
      // 	return Category.getProductsOfCategory($stateParams.name);
      // }
    }

  });

});

app.controller('CartController', function ($rootScope, $scope, $log, $q, AuthService, CartFactory) {

  // upon broadcast from resetCart() in nav-bar directive, reset cart!
  $scope.$on('emptyCart', function (event, data) {
    $scope.cartProducts = null;
    $scope.cartTotal = 0;
  })

  // for showing custom welcome message if user is logged in
  AuthService.getLoggedInUser()
    .then(user => {
      $scope.user = user;
    })
    .catch($log.error())

  // get session cart, then retrieve product information from DB
  // will ALSO update pre-existing cart info if valid user is logged in!
  CartFactory.fetchCart()
    .then(cart => {
      let cartProducts = CartFactory.getCartProducts(cart);
      return $q.all(cartProducts)
        .then(cartProducts => {
          let cartTotal = 0;
          console.log("USING SESSION CART!", cartProducts);
          // attaches current # of each product in cart & calculates total price
          cartProducts.forEach(product => {
            product.cartNumber = cart[product.id];
            cartTotal += product.cartNumber * product.price;
          })
          $scope.cartProducts = cartProducts;
          $scope.cartTotal = cartTotal;
        })
    })
    .catch($log.error());

});
