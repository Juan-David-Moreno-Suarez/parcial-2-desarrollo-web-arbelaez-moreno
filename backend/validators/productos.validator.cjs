const { body, validationResult } = require('express-validator');
const { Categoria } = require('../models/index.cjs');

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
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isString().withMessage('El nombre debe ser texto')
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres')
    .trim(),
  
  body('categoriaId')
    .notEmpty().withMessage('La categoría es obligatoria')
    .isInt().withMessage('La categoría debe ser un número')
    .custom(async (value) => {
      const categoria = await Categoria.findByPk(value);
      if (!categoria) {
        throw new Error('La categoría no existe');
      }
      return true;
    }),
  
  body('descripcion')
    .optional()
    .isString().withMessage('La descripción debe ser texto')
    .trim(),
  
  body('precio')
    .notEmpty().withMessage('El precio es obligatorio')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  
  body('costo')
    .notEmpty().withMessage('El costo es obligatorio')
    .isFloat({ min: 0 }).withMessage('El costo debe ser un número positivo'),
  
  body('stock')
    .notEmpty().withMessage('El stock es obligatorio')
    .isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),
  
  body('imagen')
    .optional()
    .isString().withMessage('La imagen debe ser texto')
    .trim(),
  
  validarResultados
];

const actualizar = [
  body('nombre')
    .optional()
    .isString().withMessage('El nombre debe ser texto')
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres')
    .trim(),
  
  body('categoriaId')
    .optional()
    .isInt().withMessage('La categoría debe ser un número')
    .custom(async (value) => {
      if (value) {
        const categoria = await Categoria.findByPk(value);
        if (!categoria) {
          throw new Error('La categoría no existe');
        }
      }
      return true;
    }),
  
  body('descripcion')
    .optional()
    .isString().withMessage('La descripción debe ser texto')
    .trim(),
  
  body('precio')
    .optional()
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  
  body('costo')
    .optional()
    .isFloat({ min: 0 }).withMessage('El costo debe ser un número positivo'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),
  
  body('imagen')
    .optional()
    .isString().withMessage('La imagen debe ser texto')
    .trim(),
  
  validarResultados
];

module.exports = {
  crear,
  actualizar
};