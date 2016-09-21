/**
 * Created by jyyeh77 on 9/18/16.
 */
app.factory('UserFactory', function ($http) {
  let UserFactory = {};
  let currentUser = null;
  console.log(currentUser)

  UserFactory.getUser = function () {
    return currentUser;
  }

  UserFactory.setUser = function (user) {
    currentUser = user;
  }

  UserFactory.getAll = function() {
  	console.log("function called")
  	return $http.get('/api/users')
  		.then(res => res.data);
  }

  return UserFactory;
})
