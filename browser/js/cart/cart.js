app.config(function($stateProvider) {

    // Register our cart state.
    $stateProvider.state('cart', {
        url: '/cart',
        controller: 'CartController',
        templateUrl: 'js/cart/cart.html',
        resolve: {

        }
    });

});

app.controller('CartController', function($rootScope, $scope, $log, $q, $state, AuthService, CartFactory) {


    // for showing custom welcome message if user is logged in
    AuthService.getLoggedInUser()
        .then(user => {
            $scope.user = user;
        })
        .catch($log.error())


    $rootScope.$on('openingCart', function(event, data) {
        load();
    });

    var cartTotalCalculator = function() {
        $scope.cartTotal = $scope.cartProducts.reduce((total, prod) => total += prod.price * prod.cartNumber, 0);
    }

    load();

    // get session cart, then retrieve product information from DB
    // will ALSO update pre-existing cart info if valid user is logged in!
    function load() {
        CartFactory.fetchCart()
            .then(cart => {
                let cartProducts = CartFactory.getCartProducts(cart);
                return $q.all(cartProducts)
                    .then(cartProducts => {

                        // attaches current # of each product in cart
                        cartProducts.forEach(product => product.cartNumber = cart[product.id]);
                        $scope.cartProducts = cartProducts;
                        cartTotalCalculator();
                    })
            })
            .catch($log.error());
    }

    //remove item from scope.cartProducts, req.session.cart, and db
    $scope.removeItem = function(productId, quantity) {
        for (var i = 0; i < $scope.cartProducts.length; i++) {
            if ($scope.cartProducts[i].id === productId) {
                $scope.cartProducts.splice(i, 1);
                break;
            }
        }
        cartTotalCalculator();
        $rootScope.$emit('updateNavBarCart', -quantity);
        CartFactory.removeItem(productId);
    };


    $scope.hardResetCart = function() {
        $scope.cartProducts = [];
        return CartFactory.hardResetCart();
    }

    // takes user to checkout page with their saved cart
    $scope.goToCheckout = function() {
        $state.go('checkout');
    }
});
