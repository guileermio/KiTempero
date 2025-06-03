const { Sequelize } = require('sequelize');
const path = require('path');

// Banco SQLite: arquivo `database.sqlite` ficará dentro da pasta server/
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false
});

module.exports = sequelize;
