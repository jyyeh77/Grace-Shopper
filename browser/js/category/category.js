app.config(function ($stateProvider) {

    // Register our category state.
    $stateProvider.state('category', {
        url: '/categories/:id',
        controller: 'CategoryController',
        templateUrl: 'js/category/category.html'
    });

});

app.controller('AboutController', function ($scope, FullstackPics) {

    // Images of beautiful Fullstack people.
    $scope.images = _.shuffle(FullstackPics);

});
