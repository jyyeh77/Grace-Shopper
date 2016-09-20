/**
 * Created by jyyeh77 on 9/19/16.
 */
app.factory('OrderFactory', function ($http) {
  let OrderFactory = {};

  // fetch 1 order based on order ID
  OrderFactory.fetchOrder = function (orderId) {
    return $http.get(`/api/orders/${orderId}`)
      .then(res => res.data)
      .catch(err => {
        err.error = true;
        return err;
      })
  }

  // fetch all orders of ANY status for a user
  OrderFactory.fetchAllUserOrders = function (user) {
    return $http.get(`/api/orders/?userId=${user.id}`)
      .then(res => res.data)
      .catch(err => {
        err.error = true;
        return err;
      })
  }

  OrderFactory.getOrderCost = function (order) {
    let total = 0;
    order.products.forEach(product => {
      total += product.price * product.quantityOrdered;
    })
    return total;
  }
  return OrderFactory;
})

