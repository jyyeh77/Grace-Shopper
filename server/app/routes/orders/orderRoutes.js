'use strict';

var router = require('express').Router();
var Order = require('../../../db/models/order');
var User = require('../../../db/models/user');
var auth = require('../../configure/authentication/auth-utils')
module.exports = router;

// gets single order if param id is included in URI (/api/orders/:id)
router.param('id', function(req, res, next, id){
	let errNotFound = new Error("Order not found.");
	errNotFound.status = 404

	Order.findById(req.params.id)
	.then(foundOrder => {
		if (!foundOrder) throw(errNotFound);
		else req.order = foundOrder;
		next()
	})
	.catch(next);
})


//get single order instance by id
router.get('/:id', function(req, res, next){
	let errForbidden = new Error("Nice try, buddy. You don't have access to this order. Now stop snooping.");
	errForbidden.status = 403;

	let user = req.session.passport.user;

	console.log("the session", req.session)

	auth.isAdmin(user)
	.then(admin => {
		if (admin || (req.isAuthenticated() && user == req.order.userId)){
			res.send(req.order)
		} else {
			return next(errForbidden);
		}
	})	
})

//update single order instance. will mostly be used to update order status
router.put('/:id', function(req, res, next){
	let errFailed = new Error("Order update failed.");
	errFailed.status = 403;

	let errForbidden = new Error("Sorry, you don't have permission to update this order.");
	errForbidden.status = 403;
	
	let user = req.session.passport.user;

	auth.isAdmin(user)
	.then(admin => {
		if (admin){
			req.order.update(req.body, {returning: true})
			.then(updatedOrder => {
				if (!updatedOrder) return next(errFailed)
				res.send(updatedOrder);
			})
			.catch(next);
		} else {
			return next(errForbidden)
		}
	})
})

// get all orders associated with a given user. admins can access all orders. 
// query string can also be used to filter by order status, e.g. "/?userId=3&status=Shipped"
router.get('/', function (req, res, next) {
	let errNoOrders = new Error("No orders found.");
	errNoOrders.status = 404;

	let errForbidden = new Error("Nice try, buddy. You don't have access to these orders. Now stop snooping.");
	errForbidden.status = 403;

	let user = req.session.passport.user

	auth.isAdmin(user)
	.then(admin => {
		if (admin || (req.isAuthenticated() && user == req.query.userId)){
			Order.findAll({where: req.query})
			.then(foundOrders => {
				if (!foundOrders.length) return next(errNoOrders);
				else res.send(foundOrders);
			})	
		} else {
			return next(errForbidden);
		}
	})
})

//create new order instance. stringifies all objects in products array before creating instance.
//users can only place orders for themselves. admins can place orders for any user.
router.post('/', function( req, res, next){
	let errFailed = new Error("Could not place order. Please try again.");
	errFailed.status = 500;

	let errForbidden = new Error("Stop trying to place orders for other people, ya dingus.");
	errForbidden.status = 403;

	let user = req.session.passport.user

	auth.isAdmin(user)
	.then(admin => {
		if (admin || (req.isAuthenticated() && user == req.body.userId)){
			req.body.products.forEach(product => {
				product = JSON.stringify(product);
			})

			Order.create(req.body)
			.then(newOrder => {
				if (!newOrder) return next(errFailed);
				else res.send(newOrder);
			})
			.catch(next);	
		} else {
			return next(errForbidden)
		}
	})
})
