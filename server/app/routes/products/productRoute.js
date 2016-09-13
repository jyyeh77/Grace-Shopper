 'use strict';
var router = require('express').Router(); // eslint-disable-line new-cap
var Product = require('../../../db/models/product');

module.exports = router;



// retrieves single product if ID parameter is specified in an /api/products/:id route
router.param('id', function (req, res, next, id) {
  Product.findById(id)
    .then(foundProduct => {
      if (!foundProduct) res.sendStatus(404)
      else req.requestedProduct = foundProduct;
      next();
    })
    .catch(next);
})

// fetch one product instance
router.get('/:id', function (req, res, next) {
  res.send(req.requestedProduct);
})

// fetch similar
router.get('/:id/similar', function(req, res, next) {
	req.requestedProduct.getSimilar()
		.then(res.send)
		.catch(next);
}


// admins can update current product info here
router.put('/:id', function (req, res, next) {
  req.requestedProduct.update(req.body)
    .then(product => {
      res.send(product);
    })
    .catch(next)
})

router.delete('/:id', function (req, res, next) {
  req.requestedProduct.destroy()
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
})
