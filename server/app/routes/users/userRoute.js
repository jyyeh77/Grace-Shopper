/**
 * Created by jyyeh77 on 9/12/16.
 */
'use strict';
const router = require('express').Router(); // eslint-disable-line new-cap
const db = require('../../../db/');
const User = db.model('user');
const authUtils = require('../../configure/authentication/auth-utils.js')
module.exports = router;

// // all api/user/ routes require the user to be an admin
// router.use('/', authUtils.ensureAdmin);

// retrieves single user if ID parameter is specified in an /api/users/:id route
router.param('id', function (req, res, next, id) {
  User.findById(id)
    .then(foundUser => {
      if (!foundUser) res.sendStatus(404);
      else req.requestedUser = foundUser.sanitize();
      next();
    })
    .catch(next);
});

router.get('/:id', function (req, res, next) {
  res.send(req.requestedUser);
});

// admins can update current user info here
router.put('/:id', function (req, res, next) {
  req.requestedUser.update(req.body)
    .then(user => res.send(user))
    .catch(next);
});

router.delete('/:id', function (req, res, next) {
  req.requestedUser.destroy()
    .then(() => res.status(204).end())
    .catch(next);
});


// router.post('/', function(req, res, next){

// })
