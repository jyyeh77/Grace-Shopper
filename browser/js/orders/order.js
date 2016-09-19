/**
 * Created by jyyeh77 on 9/19/16.
 */
app.config(function ($stateProvider) {

  // Register our order state.
  $stateProvider.state('order', {
    url: '/orders/:id',
    controller: 'OrderController',
    templateUrl: 'js/orders/order.html',
    resolve: {
      recentOrder: function ($stateParams, OrderFactory) {
        return OrderFactory.fetchOrder($stateParams.id);
      }
    }
  });
});

app.controller('OrderController', function ($scope, OrderFactory, recentOrder) {
  $scope.order = recentOrder;

})


