'use strict';

var router = require('express').Router();
var Order = require('../../../db/models/order')
module.exports = router;



//get single order instance by id
router.get('/:id', function(req, res, next){	
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
	.then(updatedBook => {
		res.send(updatedBook);
	})
	.catch(next);
})

//get all orders. option for query string ?status={insertStatusHere} to get all completed, pending, shipped, etc.
router.get('/', function(req, res, next){
	const options = {}
	if (req.query.status) options.where = {status: req.query.status};

	Order.findAll(options)
	.then(foundOrders => {
		if (!foundOrders) res.sendStatus(404);
		else res.send(foundOrders);
	})
	.catch(next);
})