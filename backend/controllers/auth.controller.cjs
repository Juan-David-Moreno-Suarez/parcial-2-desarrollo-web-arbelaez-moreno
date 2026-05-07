const { Usuario } = require('../models/index.cjs');
const { generarToken } = require('../utils/jwt.cjs');
const { Op } = require('sequelize');

// POST /api/auth/registro
const registro = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Verificar si el email ya existe
    const usuarioExiste = await Usuario.findOne({ 
      where: { email: email.toLowerCase() } 
    });

    if (usuarioExiste) {
      return res.status(400).json({ 
        mensaje: 'Este email ya está registrado' 
      });
    }

    // Crear usuario (la contraseña se hashea automáticamente en el hook)
    const usuario = await Usuario.create({
      nombre,
      email: email.toLowerCase(),
      password,
      rol: rol || 'vendedor'
    });

    // Generar token
    const token = generarToken(usuario);

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const usuario = await Usuario.findOne({ 
      where: { email: email.toLowerCase() } 
    });

    if (!usuario) {
      return res.status(401).json({ 
        mensaje: 'Email o contraseña incorrectos' 
      });
    }

    // Verificar contraseña
    const passwordValido = await usuario.verificarPassword(password);

    if (!passwordValido) {
      return res.status(401).json({ 
        mensaje: 'Email o contraseña incorrectos' 
      });
    }

    // Generar token
    const token = generarToken(usuario);

    res.json({
      mensaje: 'Login exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/perfil (requiere autenticación)
const perfil = async (req, res, next) => {
  try {
    // req.usuario viene del middleware de autenticación
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: { exclude: ['password'] }
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registro,
  login,
  perfil
};