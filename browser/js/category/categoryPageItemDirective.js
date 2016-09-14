app.directive('categoryPageItem', function ($rootScope, Category) {

    return {
        restrict: 'E',
        scope: {
            item: '='
        },
        templateUrl: 'js/category/categoryPageItem.html',
        link: function (scope) {

         }
     };

});
