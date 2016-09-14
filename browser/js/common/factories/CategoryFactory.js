app.factory('Category', function($http){

	return {
		fetchAll: function(){
			return $http.get('/api/categories')
			.then(res => res.data)
		},

		getMetaCategories: function(){
			return this.fetchAll()
			.then(categories => {
				var metaCats = []
				categories.forEach(cat => {
					if (metaCats.indexOf(cat.metaCategory) < 0) metaCats.push(cat.metaCategory)
				})
				return metaCats
			})
		}
	}
})