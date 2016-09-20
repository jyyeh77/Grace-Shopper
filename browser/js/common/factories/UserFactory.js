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

  return UserFactory;
})
