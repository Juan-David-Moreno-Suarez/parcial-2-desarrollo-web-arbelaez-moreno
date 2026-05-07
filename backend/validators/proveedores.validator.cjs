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
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres')
    .trim(),
  
  body('telefono')
    .optional()
    .isString().withMessage('El teléfono debe ser texto')
    .matches(/^\d+$/).withMessage('El teléfono debe contener solo números')
    .isLength({ min: 6 }).withMessage('El teléfono es demasiado corto')
    .trim(),
  
  validarResultados
];

const actualizar = [
  body('nombre')
    .optional()
    .isString().withMessage('El nombre debe ser texto')
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres')
    .trim(),
  
  body('telefono')
    .optional()
    .isString().withMessage('El teléfono debe ser texto')
    .matches(/^\d+$/).withMessage('El teléfono debe contener solo números')
    .isLength({ min: 6 }).withMessage('El teléfono es demasiado corto')
    .trim(),
  
  validarResultados
];

module.exports = {
  crear,
  actualizar
};