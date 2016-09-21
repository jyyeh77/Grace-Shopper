/**
 * Created by jyyeh77 on 9/16/16.
 */
'use strict';

var router = require('express').Router();
var Cart = require('../../../db/models/cart');
var User = require('../../../db/models/user');
var Product = require('../../../db/models/product');
var auth = require('../../configure/authentication/auth-utils');
var newError = require('../errorUtils').generateError;
var passport = require('passport');
module.exports = router;

// gets cart object on current session. if nothing in cart, returns empty object
router.get('/', function(req, res, next) {
    res.send(req.session.cart)
})

// sends session cart object to database. only happens if user with cart is logged in and their
// session ends or they logout, used in emptying a cart as well!
router.post('/', function(req, res, next) {
    var cart = req.session.cart;
    if (req.isAuthenticated()) {
        var user = req.session.passport.user;
        updateSavedCart(cart, user)
            .then(() => res.sendStatus(200))
    } else res.sendStatus(200);
})

// update session cart - re-routes to second PUT if req.query has nonzero keys
router.put('/', function(req, res, next) {
    if (Object.keys(req.query).length > 0) {
        next();
    } else {
        // useful for replacing session cart with stored user cart
        req.session.cart = req.body;
        res.send(req.session.cart);
    }
})

// add item to session cart object. item info in query string e.g. /?prod=1&quantity=1 (product id 3, quantity 1)
router.put('/', function(req, res, next) {
    let cart = req.session.cart;
    let prodId = req.query.prod;
    let quantity = parseInt(req.query.quantity);
    if (cart[prodId]) cart[prodId] += quantity
    else cart[prodId] = quantity;
    res.send(cart);
})

// empties session cart NOTTTTT THE DATTTAAABASE CART
router.delete('/', function(req, res, next) {
    req.session.cart = {};
    res.sendStatus(204);
})

router.delete('/:prodId', function(req, res, next) {
    var cart = req.session.cart;
    delete cart[req.params.prodId];
    if (req.isAuthenticated()) {
        var user = req.session.passport.user;
        updateSavedCart(cart, user)
            .then(() => res.sendStatus(200))
    } else res.sendStatus(200);
})

function updateSavedCart(theCart, user) {
    return Cart.findOrCreate({ where: { userId: user } })
        .spread(cart => {
            cart.update({ itemCounts: theCart })
        })
}


