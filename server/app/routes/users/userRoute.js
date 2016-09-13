/**
 * Created by jyyeh77 on 9/12/16.
 */
'use strict';
var router = require('express').Router(); // eslint-disable-line new-cap
var User = require('../../../db/models/user')
var Order = require('../../../db/models/order')
module.exports = router;

// retrieves single user if ID parameter is specified in an /api/users/:id route
router.param('id', function (req, res, next, id) {
  console.log("ID: ", id);
  User.findById(id)
    .then(foundUser => {
      console.log("TESTING!!!!");
      if (!foundUser) res.sendStatus(404)
      else req.requestedUser = foundUser;
      next();
    })
    .catch(next);
})

// fetch one user instance
router.get('/:id', function (req, res, next) {
  res.send(req.requestedUser);
})

// use this route to retrieve orders associated with user instance
router.get('/:id/orders', function (req, res, next) {
  req.requestedUser.reload({include: [Order]})
    .then(user => {
      res.send(user);
    })
    .catch(next);
})

// admins can update current user info here
router.put('/:id', function (req, res, next) {
  console.log("PARAM: ", req.params.id);
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
