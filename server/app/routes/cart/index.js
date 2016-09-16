'use strict';

var router = require('express').Router();
var Cart = require('../../../db/models/cart');
var User = require('../../../db/models/user');
var Product = require('../../../db/models/product');
var auth = require('../../configure/authentication/auth-utils');
var newError = require('../errorUtils').generateError;
module.exports = router;

// gets cart object on current session. if nothing in cart, returns empty object
router.get('/', function(req, res, next){
	res.send(req.session.cart)
})

// sends session cart object to database. only happens if user with cart is logged in and their 
// session ends or they logout
router.post('/', function(req, res, next){
	let cart = req.session.cart;

	if (req.isAuthenticated() && Object.keys(cart).length){
		let user = req.session.passport.user;
		Cart.findOrCreate({where: {userId: user}})
		.spread(cart => {
			cart.update({itemCounts: cart})
		})
		.then(() => res.sendStatus(200))
	}
})

// add item to session cart object. item info in query string e.g. /?prod=1&quantity=1 (product id 3, quantity 1)
router.put('/', function(req, res, next){
	let cart = req.session.cart;
	let prodId = req.query.prod;
	let quantity = Number(req.query.quantity);

	(cart[prodId]) ? cart[prodId] += quantity : cart[prodId] = quantity;
	res.send(cart);
})



//possible method for getting a user's cart
// if (req.session.cart) {
// 	res.send(req.session.cart)
// } else if (req.isAuthenticated()){
// 	let user = req.session.passport.user;
// 	User.findById(user, {include: cart})
// 	.then(foundUser => {
// 		!foundUser.cart ? req.session.cart = {} : req.session.cart = foundUser.cart;
// 	})
// } else {
// 	req.session.cart = {};
// }