/**
 * Created by jyyeh77 on 9/12/16.
 */
'use strict';
var router = require('express').Router(); // eslint-disable-line new-cap
var User = require('../../../db/models/user')
var Order = require('../../../db/models/order')
var authUtils = require('../../configure/authentication/auth-utils.js')
module.exports = router;

// retrieve cart via user email
router.get('/cart/:email', function (req, res, next) {
  if (req.isAuthenticated()) {
    User.findOne({ where : { email: req.params.email } })
      .then(foundUser => {
        return foundUser.getCart()
          .then(userCart => res.send(userCart));
      })
      .catch(next);
  }
})

// retrieves single user if ID parameter is specified in an /api/users/:id route

router.param('id', function (req, res, next, id) {
  User.findById(id)
    .then(foundUser => {
      if (!foundUser) res.sendStatus(404)
      else req.requestedUser = foundUser.sanitize();
      next();
    })
    .catch(next);
})

//ensureAdminOrCurrentUser
router.get('/', authUtils.ensureAdmin, function(req, res, next){
  if (req.query.email){
    User.findOne({
      where: {
        email: req.query.email
      }
    })
    .then(foundUser => res.send(foundUser))
    .catch(next)
  } else {
    User.findAll()
    .then(users => res.send(users))
    .catch(next)
  }
})

// retrieve single user based on ID
router.get('/:id', authUtils.ensureAdmin, function (req, res, next) {
  res.send(req.requestedUser);
})

// admins can update current user info here
router.put('/:id', function (req, res, next) {
    User.findById(req.params.id)
    .then(foundUser => foundUser.update(req.body))
    .then(user => {
      res.send(user);
    })
    .catch(next)
})

router.delete('/:id', function (req, res, next) {
    User.findById(req.params.id)
    .then(foundUser => foundUser.destroy())
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
})

