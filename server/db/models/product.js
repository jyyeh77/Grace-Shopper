'use strict';

var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('product', {
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
});



