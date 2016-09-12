'use strict';

var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('category', {
    id: {
      type: Sequelize.STRING
    },
    category: {
      type: Sequelize.STRING
    },
  }
);
