app.config(function ($stateProvider) {

  // Register our cart state.
  $stateProvider.state('cart', {
    url: '/cart',
    controller: 'CartController',
    templateUrl: 'js/cart/cart.html',
    resolve: {

    }
  });

});

app.controller('CartController', function ($rootScope, $scope, $log, $q, $state, AuthService, CartFactory) {

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

          // attaches current # of each product in cart & calculates total price
          cartProducts.forEach(product => {
            product.cartNumber = cart[product.id];
            cartTotal += product.cartNumber * product.price;
          })

          $scope.cartProducts = cartProducts;
          $scope.cartTotal = cartTotal;

          // will hide checkout button if no items in cart!
          $scope.checkoutStatus = CartFactory.checkoutStatus(cartTotal);
        })
    })
    .catch($log.error());

    // takes user to checkout page with their saved cart
    $scope.goToCheckout = function () {
      $state.go('checkout');
    }
});
