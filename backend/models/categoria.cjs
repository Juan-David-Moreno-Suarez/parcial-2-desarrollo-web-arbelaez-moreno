'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categoria extends Model {
    static associate(models) {
      // Una categoría tiene muchos productos
      Categoria.hasMany(models.Producto, {
        foreignKey: 'categoriaId',
        as: 'productos'
      });
    }
  }
  Categoria.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Categoria',
    tableName: 'Categorias'
  });
  return Categoria;
};