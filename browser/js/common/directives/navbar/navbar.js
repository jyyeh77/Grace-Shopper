app.directive('navbar', function($rootScope, AuthService, AUTH_EVENTS, $state, Category) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function(scope) {


            Category.fetchAll()
                .then(cats => scope.categories = cats);

            Category.getMetaCategories()
                .then(cats => scope.metaCategories = cats);

            scope.subCats = function(metaCat){
                return scope.categories.filter(function(cat){
                    console.log('cat, meta', cat, cat.metaCategory)
                    return cat.metaCategory === metaCat;
                });
            };

            scope.inMetaCat = function(category) {
                // console.log("category: " + category);
                // console.log("metaCAt: " + metaCategory)
                // console.log("result" + category.metaCategory === metaCategory)
                return category.metaCategory === 'Electronics'
            }


            scope.user = null;

            scope.isLoggedIn = function() {
                return AuthService.isAuthenticated();
            };

            scope.logout = function() {
                AuthService.logout().then(function() {
                    $state.go('home');
                });
            };

            var setUser = function() {
                AuthService.getLoggedInUser().then(function(user) {
                    scope.user = user;
                });
            };

            var removeUser = function() {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});

// app.filter('inMetaCat', function(){
//     return function(category){
//         return category.metaCategory === 'Electronics'
//     }
// })
