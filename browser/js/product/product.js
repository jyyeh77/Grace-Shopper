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
  $scope.isAvailable = Product.checkAvailability(theProduct)
  $scope.quantity = 1;
  $scope.cartSuccess = false;
  $scope.specs = JSON.parse($scope.product.specs);
  $scope.reviews = $scope.product.reviews;
  $scope.starOptions = ['1', '2', '3', '4', '5'];

  AuthService.getLoggedInUser()
  .then(user => {
    $scope.user = user;
  })

  //makes put request via product factory to add review to product
  $scope.addReview = function(){
    var stars = $scope.review.stars;
    var content = $scope.review.content;
    var id = $scope.product.id
    Product.addReview(id, {stars: stars, content: content, productId: id})
      .then(() => $state.reload())
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
  // sends product ID and quantity of product to be added to cart upon pressing ADD TO CART
  $scope.editProductNum = function (product) {
    let productInCart = {id: product.id, quantity: $scope.quantity};
    // to successfully added product!
    $scope.cartSuccess = true;
    // sends product quantity to nav-bar cart for update
    $rootScope.$emit('updateNavBarCart', $scope.quantity);
    return CartFactory.editProductNum(productInCart);
  }

  // for rendering similar products!
  Product.getSimilarProducts($scope.product)
    .then(similar => {
      $scope.similarProducts = similar;
    })
    .catch(function(err){
      alert("ERROR: ", err.message);
    })

});
