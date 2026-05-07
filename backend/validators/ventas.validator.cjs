const { body, validationResult } = require('express-validator');
const { Cliente } = require('../models/index.cjs');

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
  
  body('clienteId')
    .notEmpty().withMessage('El cliente es obligatorio')
    .isInt().withMessage('El cliente debe ser un número')
    .custom(async (value) => {
      const cliente = await Cliente.findByPk(value);
      if (!cliente) {
        throw new Error('El cliente no existe');
      }
      return true;
    }),
  
  body('metodoPago')
    .notEmpty().withMessage('El método de pago es obligatorio')
    .isString().withMessage('El método de pago debe ser texto')
    .isIn(['efectivo', 'tarjeta', 'transferencia', 'nequi', 'daviplata'])
    .withMessage('Método de pago no válido'),
  
  body('total')
    .notEmpty().withMessage('El total es obligatorio')
    .isFloat({ min: 0 }).withMessage('El total debe ser un número positivo'),
  
  body('totalPagado')
    .notEmpty().withMessage('El total pagado es obligatorio')
    .isFloat({ min: 0 }).withMessage('El total pagado debe ser un número positivo'),
  
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
          if (!item.productoId || !item.cantidad || !item.precio) {
            throw new Error(`Item ${index + 1} debe tener productoId, cantidad y precio`);
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
  
  body('clienteId')
    .optional()
    .isInt().withMessage('El cliente debe ser un número')
    .custom(async (value) => {
      if (value) {
        const cliente = await Cliente.findByPk(value);
        if (!cliente) {
          throw new Error('El cliente no existe');
        }
      }
      return true;
    }),
  
  body('metodoPago')
    .optional()
    .isString().withMessage('El método de pago debe ser texto')
    .isIn(['efectivo', 'tarjeta', 'transferencia', 'nequi', 'daviplata'])
    .withMessage('Método de pago no válido'),
  
  body('total')
    .optional()
    .isFloat({ min: 0 }).withMessage('El total debe ser un número positivo'),
  
  body('totalPagado')
    .optional()
    .isFloat({ min: 0 }).withMessage('El total pagado debe ser un número positivo'),
  
  body('itemsJson')
    .optional()
    .custom((value) => {
      try {
        const items = typeof value === 'string' ? JSON.parse(value) : value;
        if (!Array.isArray(items) || items.length === 0) {
          throw new Error('Los items deben ser un array no vacío');
        }
        
        items.forEach((item, index) => {
          if (!item.productoId || !item.cantidad || !item.precio) {
            throw new Error(`Item ${index + 1} debe tener productoId, cantidad y precio`);
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