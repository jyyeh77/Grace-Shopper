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

app.controller('CartController', function ($scope, $log, AuthService) {

  // for showing custom welcome message if user is logged in
	AuthService.getLoggedInUser()
    .then(user => {
      $scope.user = user;
    })
    .catch($log.error())
});
