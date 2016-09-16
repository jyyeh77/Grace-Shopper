app.factory('Cart', function($http) {
	return {
		addProduct: function(id, quantity) {
			$http.put('/api/cart/?prod=' + id + 'quantity=' + quantity)
		},

	}
})