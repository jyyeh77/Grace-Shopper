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
    },
    availability: {
        type: Sequelize.ENUM('In Stock', 'Out of Stock')
    }
    }, {
    instanceMethods: {
        //finds the categories of an instance, returns an array of unique instances which share 
        //at least one of those categories, without including itself in the array 
        getSimilar: function() {
            return this.getCategories()
                .then(productCategories => Promise.all(
                    productCategories.map(category =>
                        category.getProducts({
                            where: {
                                id: {
                                    $ne: this.id
                                }
                            }
                        })
                    )
                ))
            .then(similarProducts => _.uniq(_.flatten(similarProducts)));
        }
    }
});



module.exports = Product;
