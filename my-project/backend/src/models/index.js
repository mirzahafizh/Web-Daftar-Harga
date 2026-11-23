
'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.SparePart = require('./SparePart')(sequelize, DataTypes);
db.User = require('./user')(sequelize, DataTypes);
db.DiscountCode = require('./DiscountCode')(sequelize, DataTypes);

Object.keys(db).forEach((modelName) => {
    if (db[modelName] && typeof db[modelName].associate === 'function') {
        db[modelName].associate(db);
    }
});

module.exports = db;
