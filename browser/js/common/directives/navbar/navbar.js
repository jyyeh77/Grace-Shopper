app.directive('navbar', function ($rootScope, AuthService, AUTH_EVENTS, $state, Category, Product) {

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
            scope.subCats = function(metaCat){
                return scope.categories.filter(function(cat){
                    return cat.metaCategory === metaCat;
                });
            };

      // for type-ahead functionality
      Product.fetchAll()
        .then(products => scope.products = products.map(product => product.title));

      scope.select = function ($item, $model, $label) {
        Product.setSelectedProduct($item);
        Product.fetchByName()
          .then(foundProduct => {
            scope.foundProduct = foundProduct;
          });
      }

      scope.switch = function (product) {
        console.log("SWITCHING!")
        $state.go('product', {id: product.id})
      }

      scope.user = null;

      scope.isLoggedIn = function () {
        return AuthService.isAuthenticated();
      };

      scope.logout = function () {
        AuthService.logout().then(function () {
          $state.go('home');
        });
      };

      var setUser = function () {
        AuthService.getLoggedInUser().then(function (user) {
          scope.user = user;
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


