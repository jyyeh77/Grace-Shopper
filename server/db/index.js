'use strict';
var db = require('./_db');
module.exports = db;

// eslint-disable-next-line no-unused-vars
var User = require('./models/user');
var Product = require('./models/product');
var Review = require('./models/review');
var Category = require('./models/category');
var Order = require('./models/order');

// associations
User.hasMany(Order);
User.hasMany(Review);
Product.belongsToMany(Category, {through: 'product_categories'});
Category.belongsToMany(Product, {through: 'product_categories'});
Product.hasMany(Review);

// TODO: might want to add this as an alternative....
// Order.hasMany(Products);


// if we had more models, we could associate them in this file
// e.g. User.hasMany(Reports)
