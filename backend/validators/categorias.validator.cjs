const { body, validationResult } = require('express-validator');

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
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres')
    .trim(),
  validarResultados
];

const actualizar = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isString().withMessage('El nombre debe ser texto')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres')
    .trim(),
  validarResultados
];

module.exports = {
  crear,
  actualizar
};