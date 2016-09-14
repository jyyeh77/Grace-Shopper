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

app.controller('CartController', function ($scope) {
	
});
