'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      // Relaciones si las necesitas
      // Usuario.hasMany(models.Venta, { foreignKey: 'usuarioId', as: 'ventas' });
    }

    // Método para verificar contraseña
    async verificarPassword(passwordIngresado) {
      return await bcrypt.compare(passwordIngresado, this.password);
    }
  }

  Usuario.init({
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rol: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'vendedor'
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'Usuarios',
    hooks: {
      // Hook: Antes de crear, hashear la contraseña
      beforeCreate: async (usuario) => {
        if (usuario.password) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      },
      // Hook: Antes de actualizar, hashear si cambió
      beforeUpdate: async (usuario) => {
        if (usuario.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        }
      }
    }
  });

  return Usuario;
};