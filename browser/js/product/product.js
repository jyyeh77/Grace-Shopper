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

app.controller('ProductController', function ($rootScope, $scope, theProduct, CartFactory, Product) {

	$scope.product = theProduct;
  console.log($scope.product)
  $scope.quantity = 1;
  $scope.specs = JSON.parse($scope.product.specs);
  $scope.reviews = $scope.product.reviews

  //makes put request via product factory to add review to product
  $scope.addReview = function(id, data){
    return Product.addReview(id, data);
  }

  // allow user to increase/decrease quantity of product to be added to cart
  $scope.increment = function () {
    if ($scope.quantity < $scope.product.quantity) $scope.quantity++;
  }
  $scope.decrement = function () {
    if ($scope.quantity > 1) $scope.quantity--;
  }

  // turns "stars" string on each review into an array of integers that can be used in an ng-repeat
  $scope.reviews.forEach(review => {
    const stars = parseInt(review.stars);
    const starsArray = [];
    for (var i = 1; i <= stars; i++){
      starsArray.push(i);
    }
    review.stars = starsArray
    review.date = review.createdAt.slice(0,10)
  })

  console.log("updated reviews", $scope.reviews);

  // sends product ID and quantity of product to be added to cart upon pressing ADD TO CART
  $scope.editProductNum = function (product) {
    let productInCart = {id: product.id, quantity: $scope.quantity};
    // sends product quantity to nav-bar cart for update
    $rootScope.$emit('updateNavBarCart', $scope.quantity);
    return CartFactory.editProductNum(productInCart);
  }
});
