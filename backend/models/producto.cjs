'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Producto extends Model {
    static associate(models) {
      // Un producto pertenece a una categoría
      Producto.belongsTo(models.Categoria, {
        foreignKey: 'categoriaId',
        as: 'categoria'
      });
    }
  }
  Producto.init({
    nombre: DataTypes.STRING,
    categoriaId: DataTypes.INTEGER,
    descripcion: DataTypes.TEXT,
    precio: DataTypes.DECIMAL(10, 2),
    imagen: DataTypes.STRING,
    costo: DataTypes.DECIMAL(10, 2),
    stock: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Producto',
    tableName: 'Productos'
  });
  return Producto;
};