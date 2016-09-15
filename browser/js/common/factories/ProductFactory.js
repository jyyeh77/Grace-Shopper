app.factory('Product', function($http) {

    return {
        fetchById: function(id){
            return $http.get('/api/products/'+id)
                .then(res => res.data)
                .catch(err => {
                	err.error=true;
                	return err;
                });
        }
    };
});
 