/**
 * Created by jyyeh77 on 9/12/16.
 */
'use strict';

var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('review', {
    stars: {
      type: Sequelize.ENUM(1,2,3,4,5),
      allowNull: false
    },
    content: {
      type: Sequelize.TEXT
    }
  }
);
