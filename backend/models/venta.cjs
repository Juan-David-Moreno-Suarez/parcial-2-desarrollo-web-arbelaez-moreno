'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venta extends Model {
    static associate(models) {
      // Una venta pertenece a un cliente
      Venta.belongsTo(models.Cliente, {
        foreignKey: 'clienteId',
        as: 'cliente'
      });
    }
  }
  Venta.init({
    fecha: DataTypes.DATE,
    clienteId: DataTypes.INTEGER,
    metodoPago: DataTypes.STRING,
    total: DataTypes.DECIMAL(10, 2),
    totalPagado: DataTypes.DECIMAL(10, 2),
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
    modelName: 'Venta',
    tableName: 'Ventas'
  });
  return Venta;
};