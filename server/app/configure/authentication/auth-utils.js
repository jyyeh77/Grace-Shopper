'use strict';
const db = require('../../../db/index.js')
const User = db.model('user');
const utils = {
    isAdmin: function(userId){
        return User.findById(userId)
            .then(foundUser => (foundUser.isAdmin))
    },
    ensureAdmin: function(req, res, next){
        utils.isAdmin(req.session.passport.user)
        .then(userIsAdmin => {
          if (!userIsAdmin) res.redirect('/')
          next()
        })
    }
}

module.exports = utils;
