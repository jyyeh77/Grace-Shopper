/**
 * Created by jyyeh77 on 9/17/16.
 */
app.factory('CartFactory', function ($http) {
  let CartFactory = {};

  // gets existing cart on session regardless of login status
  CartFactory.fetchCart = function () {
    return $http.get('/api/cart')
      .then(res => res.data)
      .catch(err => {
        err.error=true;
        return err;
      });
  };

  // adds product ID and quantity of product as key-value pair to session cart
  CartFactory.addProduct = function (product) {
    return $http.put(`/api/cart/?prod=${product.id}&quantity=${product.quantity}`)
      .then(res => {
        // console.log("ADDING PRODUCT TO CART: ", product.id)
        return res.data
      })
      .catch(err => {
        err.error = true;
        return err;
      })

  }

  // calculates total # of items in saved cart
  CartFactory.totalQuantity = function (cartObj) {
    let sum = 0;
    for (var product in cartObj) {
      sum += cartObj[product];
    }
    return sum;
  }
  return CartFactory;

})
