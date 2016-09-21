 'use strict';
 var router = require('express').Router(); // eslint-disable-line new-cap
 var Product = require('../../../db/models/product');
 var Review = require('../../../db/models/review');
 var User = require('../../../db/models/user');

 module.exports = router;



 // retrieves single product if ID parameter is specified in an /api/products/:id route
 router.param('id', function(req, res, next, id) {
	 Product.findById(id, { include: [{ all: true }] })
		 .then(foundProduct => {
			 if (!foundProduct) {
				 var err = new Error('That product does not exist');
				 err.status = 404;
				 return next(err);
			 } else req.requestedProduct = foundProduct;
			 next();
		 })
		 .catch(next);
 });

 // fetch one product instance
 router.get('/:id', function(req, res, next) {
	 res.send(req.requestedProduct)
 });

 // fetch product by name via query string in URI
 router.post('/single/', function (req, res, next) {
   Product.findAll({
	 where: {
	   title: req.query.title
	 }
   })
	 .spread(productByName => {
	   res.send(productByName)
	 })
	 .catch(next);
 })


 //fetch all
 router.get('/', function(req, res, next) {
	 Product.findAll({ include: [{ all: true }] })
		 .then(foundProducts => {
			 if (!foundProducts) {
				 var err = new Error('We couldn\'t find those products');
				 err.status = 404;
				 return next(err);
			 } else res.send(foundProducts);
		 })
		 .catch(next);
 });

 // fetch similar
 router.get('/:id/similar', function(req, res, next) {
   console.log("GETTING SIMILAR~~~~~~~~~~~~~~~~")
	 req.requestedProduct.getSimilar()
		 .then(productArray => res.send(productArray))
		 .catch(next);
 });


 //add a review to a product. expects req.body of type {stars: '3', content: 'love it'}
 router.put('/:id/review', function(req, res, next) {
	 if (!req.user.id) {
		 var err = new Error('You must sign in to leave a review');
		 err.status = 403;
		 return next(err);
	 }
	 Promise.all([User.findById(req.user.id), Review.create(req.body)])
		 .spread((usr, rvw) => Promise.all([usr.addReview(rvw), req.requestedProduct.addReview(rvw)]))
		 .then(() => res.sendStatus(201))
		 .catch(next);

 });

 // alternate way to add review to product b/c the other one wasn't working --KF
 router.post('/:id/review', function(req, res, next){
	req.body.productId = req.params.id
	Review.create(req.body)
	.then(() => res.sendStatus(201))
 })

 // ADMINS can update current product info here
 router.put('/:id', function(req, res, next) {
	req.requestedProduct.update(req.body)
		.then(product => res.send(product))
		.catch(next);
 });

 //
 router.delete('/:id', function(req, res, next) {
	 req.requestedProduct.destroy()
		 .then(() => res.status(204).end())
		 .catch(next);
 });

router.post('/', function(req, res, next){
	Product.create(req.body)
	.then(createdProduct => res.send(createdProduct))
});
