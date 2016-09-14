app.config(function ($stateProvider) {

    // Register our category state.
    $stateProvider.state('category', {
        url: '/categories/:name',
        controller: 'CategoryController',
        templateUrl: 'js/category/category.html',
        resolve: {
        	itemsInCat: function(Category, $stateParams){
        		return Category.getProductsOfCategory($stateParams.name);
        	}
        }

    });

});

app.controller('CategoryController', function ($scope, itemsInCat, $stateParams) {
	$scope.items = itemsInCat;
	$scope.category = $stateParams.name;

});
