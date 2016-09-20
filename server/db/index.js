'use strict';
var db = require('./_db');
module.exports = db;

// eslint-disable-next-line no-unused-vars
var User = require('./models/user');
var Product = require('./models/product');
var Review = require('./models/review');
var Category = require('./models/category');
var Order = require('./models/order');
var Cart = require('./models/cart');

// associations
User.hasMany(Order);
User.hasMany(Review);
Order.belongsTo(User);
Product.belongsToMany(Category, {through: 'product_categories'});
Category.belongsToMany(Product, {through: 'product_categories'});
Product.hasMany(Review);
Review.belongsTo(Product)

User.hasOne(Cart);
Cart.belongsToMany(Product, {through: 'cart_items'});
Product.belongsToMany(Cart, {through: 'cart_items'});


// TODO: might want to add this as an alternative....
// Order.hasMany(Products);


