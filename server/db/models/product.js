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
  price: {
    type: Sequelize.INTEGER
  },
  quantity: {
    type: Sequelize.INTEGER
  },
  releaseDate: {
    type:Sequelize.STRING
  }
});
