'use strict';
var router = require('express').Router(); // eslint-disable-line new-cap
module.exports = router;

router.get('/github', function(req, res, next){
	res.redirect('https://github.com/jyyeh77/Grace-Shopper');
})

router.use('/categories', require('./categories'))

router.use('/users', require('./users/userRoute'));

router.use('/members', require('./members'));


router.use('/products', require('./products/productRoute'));

router.use('/orders', require('./orders/orderRoutes'));

router.use('/cart', require('./cart'));



// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
