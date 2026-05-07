const express = require('express');
const router = express.Router();
const proveedoresController = require('../controllers/proveedores.controller.cjs');
const proveedoresValidator = require('../validators/proveedores.validator.cjs');

// GET /api/proveedores - Obtener todos los proveedores
router.get('/', proveedoresController.getAll);

// GET /api/proveedores/:id - Obtener un proveedor por ID
router.get('/:id', proveedoresController.getById);

// POST /api/proveedores - Crear nuevo proveedor
router.post(
  '/',
  proveedoresValidator.crear,
  proveedoresController.create
);

// PUT /api/proveedores/:id - Actualizar proveedor
router.put(
  '/:id',
  proveedoresValidator.actualizar,
  proveedoresController.update
);

// DELETE /api/proveedores/:id - Eliminar proveedor
router.delete('/:id', proveedoresController.remove);

module.exports = router;