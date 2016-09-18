app.config(function ($stateProvider) {

  // Register our checkout state.
  $stateProvider.state('checkout', {
    url: '/checkout/:id',
    controller: 'CheckoutController',
    templateUrl: 'js/checkout/checkout.html',
    resolve: {
      // itemsInCat: function(Category, $stateParams){
      // 	return Category.getProductsOfCategory($stateParams.name);
      // }
    }
  });
});

app.controller('CheckoutController', function ($scope) {

})
