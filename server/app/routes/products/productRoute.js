 'use strict';
 var router = require('express').Router(); // eslint-disable-line new-cap
 var Product = require('../../../db/models/product');

 module.exports = router;



 // retrieves single product if ID parameter is specified in an /api/products/:id route
 router.param('id', function(req, res, next, id) { //!!! -- KHJH
     Product.findById(id) //eager loading ('include' http://stackoverflow.com/questions/25880539/join-across-multiple-junction-tables-with-sequelize) for reviews/categories -- KHJH
         .then(foundProduct => {
             if (!foundProduct) res.sendStatus(404); //same as before -- KHJH
             else req.requestedProduct = foundProduct;
             next();
         })
         .catch(next);
 });

 // fetch one product instance
 router.get('/:id', function(req, res, next) {
     res.send(req.requestedProduct)
 });

 //fetch all
 router.get('/', function(req, res, next){
 	Product.findAll()
 		.then(foundProducts => {
 			if (!foundProducts) res.sendStatus(404);
 			else res.send(foundProducts);
 		})
 		.catch(next);
 });

 // fetch similar
 router.get('/:id/similar', function(req, res, next) {
     req.requestedProduct.getSimilar()
         .then(function(productArray) {
             res.send(productArray);
         })
         .catch(next);
 });


 // admins can update current product info here
 router.put('/:id', function(req, res, next) {
     req.requestedProduct.update(req.body)
         .then(product => {
             res.send(product);
         })
         .catch(next);
 });

 router.delete('/:id', function(req, res, next) {
     req.requestedProduct.destroy()
         .then(() => {
             res.status(204).end();
         })
         .catch(next);
 });
