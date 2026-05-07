const { body, validationResult } = require('express-validator');
const { Proveedor } = require('../models/index.cjs');

const validarResultados = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      mensaje: 'Errores de validación',
      errores: errors.array() 
    });
  }
  next();
};

const crear = [
  body('fecha')
    .optional()
    .isISO8601().withMessage('La fecha debe estar en formato ISO8601')
    .toDate(),
  
  body('proveedorId')
    .notEmpty().withMessage('El proveedor es obligatorio')
    .isInt().withMessage('El proveedor debe ser un número')
    .custom(async (value) => {
      const proveedor = await Proveedor.findByPk(value);
      if (!proveedor) {
        throw new Error('El proveedor no existe');
      }
      return true;
    }),
  
  body('total')
    .notEmpty().withMessage('El total es obligatorio')
    .isFloat({ min: 0 }).withMessage('El total debe ser un número positivo'),
  
  body('itemsJson')
    .notEmpty().withMessage('Los items son obligatorios')
    .custom((value) => {
      try {
        const items = typeof value === 'string' ? JSON.parse(value) : value;
        if (!Array.isArray(items) || items.length === 0) {
          throw new Error('Los items deben ser un array no vacío');
        }
        
        // Validar estructura de cada item
        items.forEach((item, index) => {
          if (!item.productoId || !item.cantidad || !item.costo) {
            throw new Error(`Item ${index + 1} debe tener productoId, cantidad y costo`);
          }
        });
        
        return true;
      } catch (error) {
        throw new Error('Items inválidos: ' + error.message);
      }
    }),
  
  validarResultados
];

const actualizar = [
  body('fecha')
    .optional()
    .isISO8601().withMessage('La fecha debe estar en formato ISO8601')
    .toDate(),
  
  body('proveedorId')
    .optional()
    .isInt().withMessage('El proveedor debe ser un número')
    .custom(async (value) => {
      if (value) {
        const proveedor = await Proveedor.findByPk(value);
        if (!proveedor) {
          throw new Error('El proveedor no existe');
        }
      }
      return true;
    }),
  
  body('total')
    .optional()
    .isFloat({ min: 0 }).withMessage('El total debe ser un número positivo'),
  
  body('itemsJson')
    .optional()
    .custom((value) => {
      try {
        const items = typeof value === 'string' ? JSON.parse(value) : value;
        if (!Array.isArray(items) || items.length === 0) {
          throw new Error('Los items deben ser un array no vacío');
        }
        
        items.forEach((item, index) => {
          if (!item.productoId || !item.cantidad || !item.costo) {
            throw new Error(`Item ${index + 1} debe tener productoId, cantidad y costo`);
          }
        });
        
        return true;
      } catch (error) {
        throw new Error('Items inválidos: ' + error.message);
      }
    }),
  
  validarResultados
];

module.exports = {
  crear,
  actualizar
};