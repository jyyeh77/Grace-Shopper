app.config(function ($stateProvider) {

    // Register our category state.
    $stateProvider.state('product', {
        url: '/product/:id',
        controller: 'ProductController',
        templateUrl: 'js/product/product.html',
        resolve: {
        	theProduct: function(Product, $stateParams){
        		return Product.fetchById($stateParams.id);
        	}
        }

    });

});

app.controller('ProductController', function ($scope, theProduct) {

	$scope.product = theProduct;

});
