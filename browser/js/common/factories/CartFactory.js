/**
 * Created by jyyeh77 on 9/17/16.
 */
app.factory('CartFactory', function ($http, Product) {
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

  // gets cart from DB associated with 1 user via email
  CartFactory.fetchUserCart = function (user) {
    return $http.get(`/api/users/cart/${user.email}`)
      .then(res => res.data)
      .catch(err => {
        err.error = true;
        return err;
      })
  }

  // get products from cart - use itemCounts property as parameter if cart is retrieved from DB!!!!
  CartFactory.getCartProducts = function (cart) {
    return Object.keys(cart).map(productId => {
      return Product.fetchById(productId);
    })
  }

  // adds product ID and quantity of product as key-value pair to session cart
  CartFactory.editProductNum = function (product) {
    return $http.put(`/api/cart/?prod=${product.id}&quantity=${product.quantity}`)
      .then(res => {
        // console.log("ADDING PRODUCT TO CART: ", product.id)
        return res.data;
      })
      .catch(err => {
        err.error = true;
        return err;
      })
  }

  // save cart products on logout
  CartFactory.saveUserCart = function () {
    return $http.post('/api/cart/')
      .then(res => {
        return res.data;
      })
      .catch(err => {
        err.error = true;
        return err;
      })
  }

  // empties session cart
  CartFactory.emptyCart = function () {
    return $http.delete('/api/cart/')
      .then(res => res.data)
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
