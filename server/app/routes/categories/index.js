'use strict';
var router = require('express').Router(); // eslint-disable-line new-cap
var Category = require('../../../db/models/category');
module.exports = router;


router.get('/', function(req, res, next){
  Category.findAll()
  .then(function(allCategories){
    res.send(allCategories)
  })
});

router.get('/:category', function (req, res, next) {
  Category.findOne({
    where: {
      name: req.params.category
    }
  })
  .then(function(foundCategory){
    if (!foundCategory){
      res.send(404);
      return;
    }
    else {
      return foundCategory.getProducts();
    }
  })
  .then(products => res.send(products));
});

router.post('/:category', function(req, res, next){
  Category.create({name: req.params.category})
  .then(createdCategory => res.send(createdCategory))
});

router.delete('/:category', function(req, res, next){
  Category.destroy({
    where:{
      name: req.params.category
    } 
  })
  .then(destroyedCategory => res.send(destroyedCategory));
});
