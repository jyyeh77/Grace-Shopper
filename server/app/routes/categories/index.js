'use strict';
const router = require('express').Router(); // eslint-disable-line new-cap
const db = require('../../../db');
const Category = db.model('category');
module.exports = router;

// router.param('Category', function (req, res, next, Category) {
//   Category.findAll({
//     where: {
//       category: Category
//     }
//   })
//     .then(foundCategory => {
//       if (!foundCategory) res.sendStatus(404)
//       else req.requestedCategory = foundCategory;
//       next();
//     })
//     .catch(next);
// })

router.get('/', function(req, res, next){
  Category.findAll()
  .then(function(allCategories){
    res.send(allCategories)
  })
  .catch(next);
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
  .then(products => res.send(products))
  .catch(next);
});

router.post('/:category', function(req, res, next){
  Category.create({name: req.params.category})
  .then(createdCategory => res.send(createdCategory))
  .catch(next)
});

router.delete('/:category', function(req, res, next){
  Category.destroy({
    where:{
      name: req.params.category
    }
  }, {
    returning: true
  })
  .then( () => res.send(204) )
  .catch(next)
});
