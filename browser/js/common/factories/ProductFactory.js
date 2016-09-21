app.factory('Product', function ($http) {
  var selectProduct = null;
  return {
    fetchById: function (id) {
      return $http.get('/api/products/' + id)
        .then(res => res.data)
        .catch(err => {
          err.error = true;
          return err;
        });
    },

    fetchAll: function () {
      return $http.get('/api/products/')
        .then(res => res.data)
        .catch(err => {
          err.error = true;
          return err;
        })
    },

    // used in type-ahead to transition to correct product state
    fetchByName: function () {
      return $http.post('/api/products/single/?title=' + selectProduct)
        .then(res => res.data)
        .catch(err => {
          err.error = true;
          return err;
        })
    },

    setSelectedProduct: function (product) {
      selectProduct = product;
    },

    addReview: function (id, data) {
      return $http.post('/api/products/' + id + '/review', data)
        .then(res => res.data)
        .catch(err => {
          err.error = true;
          return err;
        })
    },

    getSimilarProducts: function (product) {
      return $http.get(`/api/products/${product.id}/similar`)
        .then(res => res.data);
    },

    createProduct: function (productObj) {
      productObj.availability = productObj.availability.type
      return $http.post('/api/products', productObj)
        .then(res => res.data)
    },

    createCategory: function (categoryObj) {
      categoryObj.metaCategory = categoryObj.metaCategory.type
      return $http.post('/api/categories', categoryObj)
        .then(res => res.data)
    },

    addProductsCategory: function (product, category) {
      return $http.post('/api/products')
    },

    updateProduct: function (product, update) {
      return $http.put(`/api/products/${product.id}`, update)
        .then(res => res.data)
    },

    checkAvailability: function (product) {
      return product.availability === 'In Stock';
    }

  };
});

