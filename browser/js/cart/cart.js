app.config(function ($stateProvider) {

  // Register our cart state.
  $stateProvider.state('cart', {
    url: '/cart',
    controller: 'CartController',
    templateUrl: 'js/cart/cart.html',
    // clean this up if it's not used. - KHJH
    resolve: {

    }
  });

});

app.controller('CartController', function ($rootScope, $scope, $log, $q, $state, AuthService, CartFactory) {
  // Great Error Handling with .catch statements, also a good idea to display those error messages to the User - KHJH

  // Could be a better idea to move this logic into a CartFactory
  // include the Cart itself and the emptyCart function  --KHJH

  // upon broadcast from resetCart() in nav-bar directive, reset cart!
  $scope.$on('emptyCart', function (event, data) {
    $scope.cartProducts = null;
    $scope.cartTotal = 0;
  })

  // Use the same method to get the logged in user
  // Accounts used a resolve -- KHJH

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
          // Can just use $scope.cartTotal instead of another variable - KHJH
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
    // .catch((err) => {
    //   alert('ERROR:', err.message)
    // })
    // - KHJH
    // don't invoke this $log.error - KHJH
    .catch($log.error());

    // takes user to checkout page with their saved cart
    $scope.goToCheckout = function () {
      $state.go('checkout');
    }
});
