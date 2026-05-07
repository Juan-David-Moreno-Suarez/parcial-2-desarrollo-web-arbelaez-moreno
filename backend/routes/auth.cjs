const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.cjs');
const authValidator = require('../validators/auth.validator.cjs');
const { autenticar } = require('../middlewares/auth.cjs');

// POST /api/auth/registro - Registrar nuevo usuario
router.post('/registro', authValidator.registro, authController.registro);

// POST /api/auth/login - Iniciar sesión
router.post('/login', authValidator.login, authController.login);

// GET /api/auth/perfil - Obtener perfil del usuario autenticado
router.get('/perfil', autenticar, authController.perfil);

module.exports = router;