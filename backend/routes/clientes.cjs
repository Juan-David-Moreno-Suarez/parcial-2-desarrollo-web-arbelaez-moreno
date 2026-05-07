const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientes.controller.cjs');
const clientesValidator = require('../validators/clientes.validator.cjs');

// GET /api/clientes - Obtener todos los clientes
router.get('/', clientesController.getAll);

// GET /api/clientes/:id - Obtener un cliente por ID
router.get('/:id', clientesController.getById);

// POST /api/clientes - Crear nuevo cliente
router.post(
  '/',
  clientesValidator.crear,
  clientesController.create
);

// PUT /api/clientes/:id - Actualizar cliente
router.put(
  '/:id',
  clientesValidator.actualizar,
  clientesController.update
);

// DELETE /api/clientes/:id - Eliminar cliente
router.delete('/:id', clientesController.remove);

module.exports = router;