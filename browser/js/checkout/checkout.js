app.config(function ($stateProvider) {

  // Register our checkout state.
  $stateProvider.state('checkout', {
    url: '/checkout/',
    controller: 'CheckoutController',
    templateUrl: 'js/checkout/checkout.html'
  });
});

app.controller('CheckoutController', function ($rootScope, $q, $log, $state, $scope, AuthService, CartFactory) {

  // upon broadcast from resetCart() in nav-bar directive, reset cart!
  $scope.$on('emptyCart', function (event, data) {
    $scope.cartProducts = null;
    $scope.cartTotal = 0;
    console.log("Emptying checkout cart!");
  })

  // gets user information from nav-bar $rootScope broadcast upon refresh...
  AuthService.getLoggedInUser()
    .then(user => {
      $scope.user = user;
      return CartFactory.fetchCart();
    })
    .then(userSessionCart => {
      return $q.all(CartFactory.getCartProducts(userSessionCart))
        .then(cartProducts => {
          let cartTotal = 0;

          // attach # of each product in cart & calculates total price
          cartProducts.forEach(product => {
            product.cartNumber = userSessionCart[product.id];
            cartTotal += product.cartNumber * product.price;
          })

          $scope.cartProducts = cartProducts;
          $scope.cartTotal = cartTotal;
        })
    })
    .catch($log.error());

  $scope.submitOrder = function (cartProducts) {
    let orderProducts = CartFactory.checkoutProducts(cartProducts);
    let finalOrder = {status: 'Pending', userId: $scope.user.id, products: orderProducts};
    return CartFactory.submitOrder(finalOrder)
      .then(savedOrder => {
        $rootScope.$broadcast('emptyOnOrder');
        $state.go('order', {id: savedOrder.id});
      })
  }
})
