'use strict';

var Sequelize = require('sequelize');
var _ = require('lodash/array');

var db = require('../_db');

var Category = require('./category');

var Product = db.define('product', {
    title: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.STRING
    },
    specs: {
        type: Sequelize.JSONB
    },
    price: {
        type: Sequelize.INTEGER
    },
    quantity: {
        type: Sequelize.INTEGER
    },
    creationDate: {
        type: Sequelize.STRING
    },
    imageUrl: {
        type: Sequelize.STRING
    }
}, {
    instanceMethods: {
        getSimilar: function() {
            return this.getCategories()
                .then(function(productCategories) {
                    return Promise.all(
                        productCategories.map(function(category) {
                            return category.getProducts({
                                where: {
                                    id: {
                                        $ne: this.id
                                    }
                                }
                            });
                        })
                    );
                })
                .then(function(similarProducts) {
                    var output = [];
                    flattenedProducts = _.flatten(similarProducts);
                    flattenedProducts.forEach(function(prod) {
                        if (!output.includes(prod)) output.push(prod);
                    });
                    return output;
                });
        }
    }
});



module.exports = Product;
