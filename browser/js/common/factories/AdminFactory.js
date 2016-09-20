app.factory('AdminFactory', function ($http) {
  let AdminFactory = {};

  AdminFactory.changeAdminStatus = function (userEmail) {
    console.log(`Making ${userEmail} an admin.`)
    return $http({
        method: 'GET',
        url: `api/users?email=${userEmail}`,
    })
    .then(res => res.data)
    .then(foundUser => {
        console.log('foundUser is', foundUser)
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
    console.log(`Deleting ${userEmail}.`)
    return $http({
        method: 'GET',
        url: `api/users?email=${userEmail}`,
    })
    .then(res => res.data)
    .then(foundUser => {
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

  // retrieves all orders
  AdminFactory.viewAllOrders = function(){
    return $http.get('/api/orders')
      .then(res => res.data)
      .catch(err => {
        err.error = true;
        return err;
      })
  }

  // updates order status in database, returns updated order status to front
  AdminFactory.setOrderStatus = function (orderId, newStatus) {
    return $http.put(`/api/orders/${orderId}`, {status: newStatus})
      .then(res => res.data)
  }


  return AdminFactory;
});
