const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller.cjs');
const productosValidator = require('../validators/productos.validator.cjs');

// GET /api/productos - Obtener todos los productos
router.get('/', productosController.getAll);

// GET /api/productos/:id - Obtener un producto por ID
router.get('/:id', productosController.getById);

// POST /api/productos - Crear nuevo producto
router.post(
  '/',
  productosValidator.crear,
  productosController.create
);

// PUT /api/productos/:id - Actualizar producto
router.put(
  '/:id',
  productosValidator.actualizar,
  productosController.update
);

// DELETE /api/productos/:id - Eliminar producto
router.delete('/:id', productosController.remove);

module.exports = router;