'use strict';

var router = require('express').Router();
var Order = require('../../../db/models/order')
module.exports = router;

//router.params -- KHJH

//get single order instance by id
router.get('/:id', function(req, res, next){ //auth only the logged in user should find their own orders/admin can see all orders (same for the following) -- KHJH
	Order.findById(req.params.id)
	.then(foundOrder => {
		if (!foundOrder) res.sendStatus(404);
		else res.send(foundOrder);
	})
	.catch(next);
})

//update single order instance. will mostly be used to update order status
router.put('/:id', function(req, res, next){
	Order.findById(req.params.id)
	.then(foundOrder => {
		if (!foundOrder) res.sendStatus(404);
		else return foundOrder.update(req.body, {returning: true});
	})
	.then(updatedOrder => {
		res.send(updatedOrder);
	})
	.catch(next);
})

//get all orders. option for query string ?status={insertStatusHere} to get all Completed, Pending, Shipped, orders etc.
router.get('/', function(req, res, next){ //get all should only get all for a specific user (logged in -- req.user) or all for the admin -- KHJH
	const options = {}
	if (req.query.status) options.where = {status: req.query.status};

	Order.findAll(options)
	.then(foundOrders => {
		if (!foundOrders) res.sendStatus(404);
		else res.send(foundOrders);
	})
	.catch(next);
})

//create new order instance. stringifies all objects in products array before creating instance
router.post('/', function( req, res, next){
	req.body.products.forEach(product => {
		product = JSON.stringify(product);
	})

	Order.create(req.body)
	.then(newOrder => {
		if (!newOrder) res.sendStatus(500)
		else res.send(newOrder);
	})
	.catch(next);
})
