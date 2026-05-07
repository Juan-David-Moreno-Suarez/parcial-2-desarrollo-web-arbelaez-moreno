const { verificarToken } = require('../utils/jwt.cjs');
const { Usuario } = require('../models/index.cjs');

/**
 * Middleware: Verificar que el usuario esté autenticado
 */
const autenticar = async (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        mensaje: 'No autorizado. Token no proporcionado' 
      });
    }

    const token = authHeader.substring(7); // Quitar "Bearer "

    // Verificar token
    const payload = verificarToken(token);

    if (!payload) {
      return res.status(401).json({ 
        mensaje: 'Token inválido o expirado' 
      });
    }

    // Verificar que el usuario aún existe
    const usuario = await Usuario.findByPk(payload.id);

    if (!usuario) {
      return res.status(401).json({ 
        mensaje: 'Usuario no encontrado' 
      });
    }

    // Agregar usuario al request para usarlo en controllers
    req.usuario = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware: Verificar que el usuario tenga un rol específico
 */
const autorizarRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ 
        mensaje: 'No autenticado' 
      });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ 
        mensaje: 'No tienes permisos para realizar esta acción' 
      });
    }

    next();
  };
};

module.exports = {
  autenticar,
  autorizarRoles
};