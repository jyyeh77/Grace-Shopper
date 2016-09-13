'use strict';
var router = require('express').Router(); // eslint-disable-line new-cap
module.exports = router;

router.use('/categories', require('./categories'))

router.use('/users', require('./users/userRoute'));

router.use('/members', require('./members'));


router.use('/products', require('./products/productRoute'));

router.use('/orders', require('./orders/orderRoutes'));



// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
