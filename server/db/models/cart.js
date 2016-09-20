/**
 * Created by jyyeh77 on 9/16/16.
 */
'use strict';

var Sequelize = require('sequelize');
let db = require('../_db');

// Ask what itemCounts is -KHJH
module.exports = db.define('cart', {

  itemCounts: {
    type: Sequelize.JSONB,
    allowNull: false,
    defaultValue: {}
  }
}
)
