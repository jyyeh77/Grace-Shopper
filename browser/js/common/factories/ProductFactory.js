app.factory('Product', function($http) {
    var selectProduct = null;
    return {
        fetchById: function(id){
            return $http.get('/api/products/'+id)
                .then(res => res.data)
                .catch(err => {
                	err.error=true;
                	return err;
                });
        },

        fetchAll: function () {
          return $http.get('/api/products/')
            .then(res => res.data)
            .catch(err => {
              err.error=true;
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

        addReview: function(id, data){
          return $http.post('/api/products/' + id + '/review', data)
          .then(res => res.data)
          .catch(err => {
            err.error = true;
            return err;
          })
        },

        createProduct: function(productObj){
          return $http.post('/api/products', productObj)
          .then(res => res.data)
        },

        createCategory: function(categoryObj){
          categoryObj.metaCategory = categoryObj.metaCategory.type
          return $http.post('/api/categories', categoryObj)
          .then(res => res.data)
        }
    };
});
