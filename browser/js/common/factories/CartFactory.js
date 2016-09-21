/**
 * Created by jyyeh77 on 9/17/16.
 */
app.factory('CartFactory', function ($rootScope, $http, Product, AuthService) {
  let CartFactory = {};

  // gets existing cart on session regardless of login status
  CartFactory.fetchCart = function () {
    return $http.get('/api/cart')
      .then(res => res.data)
      .catch(err => {
        err.error = true;
        return err;
      });
  };

  // gets cart from DB associated with 1 user via email
  CartFactory.fetchUserCart = function (userEmail) {

    return $http.get(`/api/users/cart/${userEmail}`)
      .then(res => res.data)
      .catch(err => {
        err.error = true;
        return err;
      })
  }

  CartFactory.setCart = function (userCart) {
    return $http.put('/api/cart/', userCart)
      .then(res => res.data)
      .catch(err => {
        err.error = true;
        return err;
      })
  }

  // get products from cart - use itemCounts property as parameter if cart is retrieved from DB!!!!
  // returns array of promises - must be resolved first using $q
  CartFactory.getCartProducts = function (cart) {
    return Object.keys(cart).map(productId => {
      return Product.fetchById(productId);
    })
  }

  // adds product ID and quantity of product as key-value pair to session cart
  CartFactory.editProductNum = function (product) {
    return $http.put(`/api/cart/?prod=${product.id}&quantity=${product.quantity}`)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        err.error = true;
        return err;
      })
  }

  // save cart products on logout and refresh/session exit
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

  // remove item from req.session.cart as well as user cart (if exists)
  CartFactory.removeItem = function (productId) {
    return $http.delete('api/cart/' + productId)
      .then(res => res.data);
  }

  // empties session cart
  CartFactory.emptyCart = function () {
    return $http.delete('/api/cart/')
      .then(res => {
        return res.data
      })
  }

  // empties session cart and saves result to DB
  // broadcasts resetCart to nav-bar to empty items from cart
  CartFactory.hardResetCart = function () {
    $rootScope.$broadcast('resetCart');
    return CartFactory.emptyCart()
      .then(() => {
        return CartFactory.saveUserCart();
      })
  };

  // calculates total # of items in saved cart
  CartFactory.totalQuantity = function (cartObj) {
    let sum = 0;
    for (var product in cartObj) {
      sum += cartObj[product];
    }
    return sum;
  }


  // formats cart products to save as order instance
  CartFactory.checkoutProducts = function (productArray) {
    return productArray.map(product => {
      let checkoutProduct = {
        title: product.title,
        description: product.description,
        specs: product.specs,
        price: product.price,
        quantityOrdered: product.cartNumber,
        releaseDate: product.releaseDate,
        imageUrl: product.imageUrl
      }
      return checkoutProduct;
    })
  }

  // saves order for user in database!
  CartFactory.submitOrder = function (orderObject) {
    return $http.post('/api/orders/', orderObject)
      .then(res => res.data)
      .catch(err => {
        err.error = true;
        return err;
      })
  }


  return CartFactory;

})
