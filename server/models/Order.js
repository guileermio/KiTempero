const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const MenuItem = require('./MenuItem');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  }
}, {
  tableName: 'orders',
  timestamps: true, // createdAt armazenará data do pedido
});

// Relações
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

MenuItem.hasMany(Order, { foreignKey: 'menuItemId' });
Order.belongsTo(MenuItem, { foreignKey: 'menuItemId' });

module.exports = Order;
