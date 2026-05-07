'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Compra extends Model {
    static associate(models) {
      // Una compra pertenece a un proveedor
      Compra.belongsTo(models.Proveedor, {
        foreignKey: 'proveedorId',
        as: 'proveedor'
      });
    }
  }
  Compra.init({
    fecha: DataTypes.DATE,
    proveedorId: DataTypes.INTEGER,
    total: DataTypes.DECIMAL(10, 2),
    itemsJson: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('itemsJson');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('itemsJson', JSON.stringify(value));
      }
    }
  }, {
    sequelize,
    modelName: 'Compra',
    tableName: 'Compras'
  });
  return Compra;
};