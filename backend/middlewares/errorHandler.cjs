const errorHandler = (err, req, res, next) => {
  console.error('Error capturado:', err);

  // Errores de validación de express-validator
  if (err.array) {
    return res.status(400).json({
      mensaje: 'Error de validación',
      errores: err.array()
    });
  }

  // Errores de validación de Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      mensaje: 'Error de validación',
      errores: err.errors.map(e => ({
        campo: e.path,
        mensaje: e.message
      }))
    });
  }

  // Errores de unicidad (duplicados)
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      mensaje: 'Este registro ya existe',
      errores: err.errors.map(e => ({
        campo: e.path,
        mensaje: e.message
      }))
    });
  }

  // Errores de clave foránea (relaciones)
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      mensaje: 'No se puede completar la operación debido a relaciones con otros registros'
    });
  }

  // Registro no encontrado
  if (err.name === 'SequelizeEmptyResultError') {
    return res.status(404).json({
      mensaje: 'Registro no encontrado'
    });
  }

  // Error de conexión a la base de datos
  if (err.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      mensaje: 'Error de conexión con la base de datos'
    });
  }

  // Error genérico
  res.status(err.status || 500).json({
    mensaje: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      tipo: err.name 
    })
  });
};

module.exports = errorHandler;
module.exports.default = errorHandler;
module.exports.errorHandler = errorHandler;
module.exports.__esModule = true;