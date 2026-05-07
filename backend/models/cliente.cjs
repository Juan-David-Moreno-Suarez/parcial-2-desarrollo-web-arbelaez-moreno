'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cliente extends Model {
    static associate(models) {
      // Un cliente tiene muchas ventas
      Cliente.hasMany(models.Venta, {
        foreignKey: 'clienteId',
        as: 'ventas'
      });
    }
  }
  Cliente.init({
    nombre: DataTypes.STRING,
    telefono: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Cliente',
    tableName: 'Clientes'
  });
  return Cliente;
};