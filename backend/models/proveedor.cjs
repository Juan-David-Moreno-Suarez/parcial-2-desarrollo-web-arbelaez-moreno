'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Proveedor extends Model {
    static associate(models) {
      // Un proveedor tiene muchas compras
      Proveedor.hasMany(models.Compra, {
        foreignKey: 'proveedorId',
        as: 'compras'
      });
    }
  }
  Proveedor.init({
    nombre: DataTypes.STRING,
    telefono: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Proveedor',
    tableName: 'Proveedors'
  });
  return Proveedor;
};