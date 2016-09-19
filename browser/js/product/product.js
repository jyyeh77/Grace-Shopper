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

app.controller('ProductController', function ($rootScope, $scope, theProduct, CartFactory) {

	$scope.product = theProduct;
  $scope.quantity = 1;
  $scope.specs = JSON.parse($scope.product.specs);
  console.log("product", $scope.product);
  console.log("parsed specs:", $scope.specs);

  // allow user to increase/decrease quantity of product to be added to cart
  $scope.increment = function () {
    if ($scope.quantity < $scope.product.quantity) $scope.quantity++;
  }
  $scope.decrement = function () {
    if ($scope.quantity > 1) $scope.quantity--;
  }

  // sends product ID and quantity of product to be added to cart upon pressing ADD TO CART
  $scope.editProductNum = function (product) {
    let productInCart = {id: product.id, quantity: $scope.quantity};
    // sends product quantity to nav-bar cart for update
    $rootScope.$emit('updateNavBarCart', $scope.quantity);
    return CartFactory.editProductNum(productInCart);
  }
});
