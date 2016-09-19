/**
 * Created by jyyeh77 on 9/19/16.
 */
app.factory('OrderFactory', function ($http) {
  let OrderFactory = {};
  OrderFactory.fetchOrder = function (orderId) {
    return $http.get(`/api/orders/${orderId}`)
      .then(res => res.data)
      .catch(err => {
        err.error = true;
        return err;
      })
  }

  return OrderFactory;
})

