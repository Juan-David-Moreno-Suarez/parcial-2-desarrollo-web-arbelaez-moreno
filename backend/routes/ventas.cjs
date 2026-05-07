const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventas.controller.cjs');
const ventasValidator = require('../validators/ventas.validator.cjs');

// GET /api/ventas - Obtener todas las ventas
router.get('/', ventasController.getAll);

// GET /api/ventas/:id - Obtener una venta por ID
router.get('/:id', ventasController.getById);

// POST /api/ventas - Crear nueva venta
router.post(
  '/',
  ventasValidator.crear,
  ventasController.create
);

// PUT /api/ventas/:id - Actualizar venta
router.put(
  '/:id',
  ventasValidator.actualizar,
  ventasController.update
);

// DELETE /api/ventas/:id - Eliminar venta
router.delete('/:id', ventasController.remove);

module.exports = router;