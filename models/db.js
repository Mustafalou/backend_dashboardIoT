// models/index.js
const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('technivoriot', 'technivor', 'bdzaa$', {
  host: "192.168.1.2",
  dialect: "postgres",
});

const db = {};

fs.readdirSync(__dirname)
  .filter(file => file !== 'db.js' && file.endsWith('.js'))
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
