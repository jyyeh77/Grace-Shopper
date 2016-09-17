app.directive('navbar', function ($rootScope, AuthService, AUTH_EVENTS, $state, Category, Product, CartFactory) {

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

      // fetches cart information from session
      CartFactory.fetchCart()
        .then(cart => {
          if (!scope.user) {
            scope.cart = cart;
            // default # of items in cart is 0, otherwise set to sum of all items in current cart!
            if (CartFactory.totalQuantity(scope.cart) > 0) scope.cartQuantity = CartFactory.totalQuantity(scope.cart)
            else scope.cartQuantity = 0
            console.log("No user logged in - cart is temporary! ", scope.cart);
          }
        });

      // TODO: might want to consider using cart factory instead + scope.watch
      // listens for emit event from ADD TO CART click in Product Controller
      $rootScope.$on('updateNavBarCart', function (event, data) {
        scope.cartQuantity = scope.cartQuantity + data;
      })

      // only resets cart quantity in nav-bar scope, but NOT in session!
      scope.resetCart = function () {
        scope.cartQuantity = 0;
        // TODO: only empties session cart!
        // updates nav-bar cart
        $rootScope.$broadcast('emptyCart');
        return CartFactory.emptyCart();
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

          if (scope.user) {
            console.log("User logged in, using their cart from DB!", scope.user.email)
            // empties pre-existing session cart upon login
            scope.cartQuantity = 0;
            return CartFactory.emptyCart()
              .then(() => {
                return CartFactory.fetchUserCart(scope.user)
                  .then(userCart => {
                    console.log("FETCHING CART FOR USER ON NAVBAR!", userCart);
                    scope.cartQuantity = CartFactory.totalQuantity(userCart.itemCounts)
                  });
              });
          } else {
            console.log("NO USER LOGGED IN UPON SESSION RETURN");
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

    }

  };

});


