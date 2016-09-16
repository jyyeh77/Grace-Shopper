'use strict';

var router = require('express').Router();
var Cart = require('../../../db/models/cart');
var User = require('../../../db/models/user');
var Product = require('../../../db/models/product');
var auth = require('../../configure/authentication/auth-utils');
var newError = require('../errorUtils').generateError;
module.exports = router;


// gets single cart instance if cart param is in URI
// router.param('id', function(req, res, next, id){
// 	let errNotFound = newError("Cart not found", 404);

// 	if (req.session.cart){
// 		next();
// 	} else if (req.isAuthenticated()) {
// 		Cart.findById(req.params.id)
// 		.then(foundCart => {
// 			if (!foundCart) return next(errNotFound)
// 			else req.session.cart = foundCart;
// 			next()
// 		})
// 		.catch(next);
// 	}
// })

// gets a single cart instance. first tries to use session cart object, then queries database if necessary
// for authenticated users, otherwise creates new empty session cart
router.get('/', function(req, res, next){
	res.send(req.session.cart)
})

//gets single cart by id
router.get('/:id', function(req, res, next){
	res.send(req.session.cart);
})

router.post('/', function(req, res, next){
	let cart = req.session.cart;

	if (req.isAuthenticated() && Object.keys(cart).length){
		let user = req.session.passport.user;

		Cart.findOrCreate({where: {userId: user}})
		.spread(cart =>{
			return cart.update({itemCounts: cart}, {returning: true})
		})
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
