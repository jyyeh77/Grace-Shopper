app.directive('navbar', function ($rootScope, AuthService, AUTH_EVENTS, $state, Category, Product, CartFactory, UserFactory) {

  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'js/common/directives/navbar/navbar.html',
    link: function (scope) {

      // for rendering dropdown category menus
      Category.fetchAll()
        .then(cats => scope.categories = cats);

      Category.getMetaCategories()
        .then(cats => scope.metaCategories = cats);
      scope.subCats = function (metaCat) {
        return scope.categories.filter(function (cat) {
          return cat.metaCategory === metaCat;
        });
      };

      // for type-ahead functionality
      Product.fetchAll()
        .then(products => scope.products = products.map(product => product.title));

      // finds product in DB by name and sends back all product info upon select
      scope.select = function ($item, $model, $label) {
        Product.setSelectedProduct($item);
        Product.fetchByName()
          .then(foundProduct => {
            scope.foundProduct = foundProduct;
          });
      }

      // switches to correct single product page upon search
      scope.switch = function (product) {
        $state.go('product', {id: product.id})
      }

      scope.goToCart = function(){
        $rootScope.$broadcast('openingCart');
        $state.go('cart');
      }

      // fetches cart information from session to update cart quantity in NAV-BAR
      CartFactory.fetchCart()
        .then(cart => {
          if (!scope.isLoggedIn()) {
            scope.cart = cart;
            // default # of items in cart is 0, otherwise set to sum of all items in current cart!
            if (CartFactory.totalQuantity(scope.cart) > 0) scope.cartQuantity = CartFactory.totalQuantity(scope.cart)
            else scope.cartQuantity = 0
          }
        });

      // TODO: might want to consider using cart factory instead + scope.watch
      // listens for emit event from ADD TO CART click in Product Controller
      $rootScope.$on('updateNavBarCart', function (event, data) {
        scope.cartQuantity = scope.cartQuantity + data;
      })

      // only resets cart quantity in nav-bar scope, but NOT in session!
      // scope.resetCart = function () {
      //   emptyCart();
      // }

      $rootScope.$on('resetCart', function(event){
        scope.cartQuantity = 0;
      })

      var emptyCart = function () {
        scope.cartQuantity = 0;
        return CartFactory.emptyCart()
          .then(() => {
            return CartFactory.saveUserCart();
          })
      }

      scope.user = null;


      let cartLogout = function () {
        return AuthService.logout().then(function () {
          // empties nav-bar cart on logout
          scope.cartQuantity = 0;
          // empties req.session.cart on logout!
          return CartFactory.emptyCart()
            .then(() => $state.go('home'))
        });
      }

      scope.isLoggedIn = function () {
        return AuthService.isAuthenticated();
      };

      // saves session cart to database for user on logout
      scope.logout = function () {
        UserFactory.setUser(null);
        scope.isAdmin = false;
        return CartFactory.fetchCart()
          .then(cart => {
            // only save user session cart if there are items in cart!
            if (Object.keys(cart).length > 0) {
              return CartFactory.saveUserCart(cart)
                .then(() => {
                  cartLogout();
                })
            } else {
              cartLogout();
            }
          })
      };

      var setUser = function () {
        AuthService.getLoggedInUser().then(function (user) {
          scope.user = user;

          // for cart persistence ONLY DURING login
          if (scope.isLoggedIn()) {

            // TODO: THIS IS A MAJOR SECURITY RISK!!
            if (scope.user.isAdmin){
              scope.isAdmin = true
            } else {
              scope.isAdmin = false
            }

            return CartFactory.fetchCart()
              .then(updatedUserCart => {
                // we need this condition for refreshes while logged in as session Cart WONT BE EMPTY!
                if (Object.keys(updatedUserCart).length > 0) {
                  // upon refresh, will save updated user cart if user is logged in
                  return CartFactory.saveUserCart(updatedUserCart)
                    .then(() => {
                      // empties session cart once updated cart is saved
                      scope.cartQuantity = 0;
                      return CartFactory.emptyCart()
                        .then(() => {
                          return CartFactory.fetchUserCart(scope.user.email)
                            .then(userCart => {
                              var quant = CartFactory.totalQuantity(userCart.itemCounts);
                              scope.cartQuantity = quant;
                              // sets req.sessionscart to current user cart item counts
                              return CartFactory.setCart(userCart.itemCounts);
                            });
                        });
                    })
                } else { // upon LOGIN, only retrieve pre-existing user cart, don't save empty session cart...
                  return CartFactory.emptyCart()
                    .then(() => {
                      return CartFactory.fetchUserCart(scope.user.email)
                        .then(userCart => {
                          scope.cartQuantity = CartFactory.totalQuantity(userCart.itemCounts);
                          // sets req.session.cart to current user cart item counts
                          return CartFactory.setCart(userCart.itemCounts);
                        });
                    })
                }
              })
          }
        });
      };

      var removeUser = function () {
        scope.user = null;
      };

      setUser();

      $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
      $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
      $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);
      $rootScope.$on('emptyOnOrder', emptyCart);

    }

  };

});


