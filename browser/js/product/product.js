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

app.controller('ProductController', function ($rootScope, $state, $scope, theProduct, CartFactory, Product, AuthService) {

	$scope.product = theProduct;
  $scope.quantity = 1;
  $scope.specs = JSON.parse($scope.product.specs);
 
  AuthService.getLoggedInUser()
  .then(user => {
    $scope.user = user;
  })

  /*----------------------------------- REVIEWS -----------------------------------*/ 

  // format review data for use in ui (stars -> array for ng-repeat and date -> yyyy/mm/dd)
  $scope.product.reviews.forEach(review => {
    review.stars = _.range(1, parseInt(review.stars) + 1);
    review.date = review.createdAt.slice(0,10);
  })

  // adds new review to product, then reloads state to instantly display new review
  $scope.addReview = function(){
    Product.addReview($scope.product.id, { 
      stars: $scope.review.stars, 
      content: $scope.review.content, 
      productId: $scope.product.id
    })
    .then(() => $state.reload())
  }

  /*-----------------------------------------------------------------------------*/

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

  // for rendering similar products!
  Product.getSimilarProducts($scope.product)
    .then(similar => {
      $scope.similarProducts = similar;
      console.log("SIMILAR PRODUCTS", $scope.similarProducts);
    })
    .catch(function(err){
      alert("ERROR: ", err.message);
    })

});
