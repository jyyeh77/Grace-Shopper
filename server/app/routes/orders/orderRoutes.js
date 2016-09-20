'use strict';

var router = require('express').Router();
var Order = require('../../../db/models/order');
var User = require('../../../db/models/user');
var auth = require('../../configure/authentication/auth-utils');
var newError = require('../errorUtils').generateError;
module.exports = router;



// gets single order if param id is included in URI (/api/orders/:id)
router.param('id', function(req, res, next, id){
	let errNotFound = newError("Order not found.", 404);

	Order.findById(req.params.id, {include: [User]})
	.then(foundOrder => {
		if (!foundOrder) throw(errNotFound);
		else {
		  // convert stringified products back into JSON object
		  foundOrder.products = foundOrder.getOrderProducts();

      req.order = foundOrder;

      // uses getter method to calculate order total prior to sending order to front
      req.order.total = foundOrder.getTotal;
    }
		next()
	})
	.catch(next);
})


//get single order instance by id
router.get('/:id', function(req, res, next){
	let errForbidden = newError("Nice try, buddy. You don't have access to this order. Now stop snooping.", 403);
	let user = req.session.passport.user;

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
	let errFailed = newError("Order update failed.", 500);
	let errForbidden = newError("Sorry, you don't have permission to update this order.", 403)
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
	let errNoOrders = newError("No orders found", 404);
	let errForbidden = newError("Nice try, buddy. You don't have access to these orders. Now stop snooping.", 403);
	let user = req.session.passport.user

	auth.isAdmin(user)
	.then(admin => {
		if (admin || (req.isAuthenticated() && user == req.query.userId)){
			Order.findAll({where: req.query, include: [User]})
			.then(foundOrders => {
				if (!foundOrders.length) return next(errNoOrders);
				else {
				  foundOrders.forEach(order => {
				    order.products = order.getOrderProducts();
          })
				  res.send(foundOrders);
        }
			})
		} else {
			return next(errForbidden);
		}
	})
})

//create new order instance. stringifies all objects in products array before creating instance.
//users can only place orders for themselves. admins can place orders for any user.
router.post('/', function( req, res, next){
	let errFailed = newError("Could not place order. Please try again.", 500);
	let errForbidden = newError("Stop trying to place orders for other people, ya dingus.", 403);
	let user = req.session.passport.user

	auth.isAdmin(user)
	.then(admin => {
		if (admin || (req.isAuthenticated() && user == req.body.userId)){
			req.body.products = req.body.products.map(product => {
				return JSON.stringify(product);
			})
			Order.create(req.body)
			.then(newOrder => {
				if (!newOrder) {
				  return next(errFailed);
        }
				else res.send(newOrder);
			})
			.catch(next);
		} else {
			return next(errForbidden)
		}
	})
})
