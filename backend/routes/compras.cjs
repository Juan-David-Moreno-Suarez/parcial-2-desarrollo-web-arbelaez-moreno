const express = require('express');
const router = express.Router();
const comprasController = require('../controllers/compras.controller.cjs');
const comprasValidator = require('../validators/compras.validator.cjs');

// GET /api/compras - Obtener todas las compras
router.get('/', comprasController.getAll);

// GET /api/compras/:id - Obtener una compra por ID
router.get('/:id', comprasController.getById);

// POST /api/compras - Crear nueva compra
router.post(
  '/',
  comprasValidator.crear,
  comprasController.create
);

// PUT /api/compras/:id - Actualizar compra
router.put(
  '/:id',
  comprasValidator.actualizar,
  comprasController.update
);

// DELETE /api/compras/:id - Eliminar compra
router.delete('/:id', comprasController.remove);

module.exports = router;