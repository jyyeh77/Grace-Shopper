/**
 * Created by jyyeh77 on 9/12/16.
 */
'use strict';

var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('order', {
    content: {
      type: Sequelize.STRING
    },
  }
);
