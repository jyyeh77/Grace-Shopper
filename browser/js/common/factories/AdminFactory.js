app.factory('AdminFactory', function ($http) {
  let AdminFactory = {};

  AdminFactory.changeAdminStatus = function (userEmail) {
    console.log(`Making ${userEmail} an admin.`)
    // $http.get(URL) - KHJH
    return $http({
        method: 'GET',
        url: `api/users?email=${userEmail}`,
    })
    .then(res => res.data)
    .then(foundUser => {
        // Chop chop this log. - KHJH
        console.log('foundUser is', foundUser)
        // $http.put(URL, dataObj) - KHJH
        $http({
            method:'PUT',
            url: `api/users/${foundUser.id}`,
            data: {
                isAdmin: 'TRUE'
            }
        })
    })
  }

  AdminFactory.deleteUser = function(userEmail){
    // Chop chop this log. - KHJH
    console.log(`Deleting ${userEmail}.`)
    // Same comment as above. - KHJH
    return $http({
        method: 'GET',
        url: `api/users?email=${userEmail}`,
    })
    .then(res => res.data)
    .then(foundUser => {
      // Same comment as above. - KHJH
        return $http({
            method: 'delete',
            url: `api/users/${foundUser.id}`

        })
    })
    //or just set user to inactive?

  }

  AdminFactory.resetPassword = function(userEmail){
    return $http({
        method: 'GET',
        url: `api/users?email=${userEmail}`,
    })
    .then(res => res.data)
    .then(foundUser => {
         return $http({
            method: 'put',
            url: `api/users/${foundUser.id}`
         })
    })
  }

  AdminFactory.viewAllOrders = function(){
    return $http({
        method: 'GET',
        url: 'api/orders'
    })
  }


  return AdminFactory;
});
