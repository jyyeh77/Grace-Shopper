/**
 * Created by jyyeh77 on 9/12/16.
 */
'use strict';

var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('order', {
    status: {
      type: Sequelize.ENUM('Pending', 'Completed', 'Shipped', 'Cancelled'),
      allowNull: false,
    },
    products: {
      type: Sequelize.ARRAY(Sequelize.TEXT),
      allowNull: false,
      defaultValue: []
    }
  },
  {
    getterMethods: {
      getTotal: function () {
        return this.products.reduce((prev, curr) => {
          let productTotal = curr.price * curr.quantityOrdered;
          return prev + productTotal;
        }, 0);
      }
    },
    instanceMethods: {
      getOrderProducts: function () {
        return this.products.map(product => {
          return JSON.parse(product);
        })
      }
    }
  }

);
