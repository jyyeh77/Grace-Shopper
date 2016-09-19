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
  if (req.query){
    User.findOne({
      where: {
        email: req.query.email
      }
    })
    .then(foundUser => res.send(foundUser))
  } else {
    User.findAll(users => res.send(users))
  }
})

router.get('/:id', authUtils.ensureAdmin, function (req, res, next) {
  console.log('sesh:',req.session.passport.user)
  res.send(req.requestedUser);
})

// admins can update current user info here
router.put('/:id', function (req, res, next) {
  req.requestedUser.update(req.body)
    .then(user => {
      res.send(user);
    })
    .catch(next)
})

router.delete('/:id', function (req, res, next) {
  req.requestedUser.destroy()
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
})

//change this to a /signup
router.post('/', function(req, res, next){
  //   User.find({
  //     where: {
  //       email: req.body.email,
  //     }
  //   })
  //   .then(userExists => {
  //     console.log('running asfdas', userExists)
  //     if (!userExists) {
  //       User.create({
  //         email: req.body.email,
  //         password: req.body.password
  //       })
  //       .then(createdUser => res.send(createdUser))
  //     } else {
  //       res.send('user exists ')
  //     }
  //   })


  // .catch(next);
})
