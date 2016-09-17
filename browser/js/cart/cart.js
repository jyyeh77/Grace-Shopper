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

app.controller('CartController', function ($scope, $log, $q, AuthService, CartFactory, Product) {

  // for showing custom welcome message if user is logged in
  AuthService.getLoggedInUser()
    .then(user => {
      $scope.user = user;
    })
    .catch($log.error())

  // get session cart, then retrieve product information from DB
  CartFactory.fetchCart()
    .then(cart => {
      let cartProducts = Object.keys(cart).map(productId => {
        return Product.fetchById(productId);
      })
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
        })
    })
    .catch($log.error());

});
