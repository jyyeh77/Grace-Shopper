'use strict';
const db = require('../../../db/index.js')
const User = db.model('user');
const utils = {
    isAdmin: function(userId){
        return User.findById(userId)
            .then(foundUser => (foundUser.isAdmin))
    },
    ensureAdmin: function(req, res, next){
      // req.user should already be deseralized by passport
      // could check req.user.isAdmin property - KHJH
        utils.isAdmin(req.session.passport.user)
        .then(userIsAdmin => {
          if (!userIsAdmin) res.redirect('/')
          next()
        })
    }
}

module.exports = utils;
