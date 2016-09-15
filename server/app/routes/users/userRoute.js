/**
 * Created by jyyeh77 on 9/12/16.
 */
'use strict';
var router = require('express').Router(); // eslint-disable-line new-cap
var User = require('../../../db/models/user')
var Order = require('../../../db/models/order')
module.exports = router;

//don't forget to sanitize your user (instance method defined in the model). Consider auth utils folder/file -- KHJH

// retrieves single user if ID parameter is specified in an /api/users/:id route
router.param('id', function (req, res, next, id) { // love this! -- KHJH
  User.findById(id)
    .then(foundUser => {
      if (!foundUser) res.sendStatus(404) // use error handling middleware and next -- KHJH
      else req.requestedUser = foundUser;//founduser.sanitize(); -- kHJH
      next();
    })
    .catch(next);
})

//add a get all for admin and narrow search by req.user if not admin -- KHJH

// fetch one user instance
router.get('/:id', function (req, res, next) { //this should only happen for admins/logged in user (and the following). I would think /home for everything about a logged in user or get but have a query based on req.user -- unless you guys are wanting to have other users view other people's profiles -- KHJH
  res.send(req.requestedUser);
})

// use this route to retrieve orders associated with user instance
router.get('/:id/orders', function (req, res, next) { // this should be in the orders (as you have it) and query based on req.user -- KHJH
  req.requestedUser.reload({include: [Order]})
    .then(user => {
      res.send(user);
    })
    .catch(next);
})

// admins can update current user info here
router.put('/:id', function (req, res, next) {
  //don't let someone make themselves admin --- KHJH
  req.requestedUser.update(req.body)
    .then(user => {
      res.send(user);
    })
    .catch(next)
})

router.delete('/:id', function (req, res, next) { //do you actually want to delete a user or potentially just have active/inactive for actual business purposes -- KHJH
  req.requestedUser.destroy()
    .then(() => {
      res.status(204).end(); //sendstatus -- KHJH
    })
    .catch(next);
})

router.post('/', function(req, res, next){ //what is this for? Admin creating users? If so, check that -- KH

  // maybe make this find or create in order to customize error messages on front end?
  User.create({
    email: req.body.email,
    password: req.body.password
  })
  .then(result => res.send(result.data))
  .catch(next);
})
