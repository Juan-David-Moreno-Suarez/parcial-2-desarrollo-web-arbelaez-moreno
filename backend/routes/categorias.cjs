const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categorias.controller.cjs');
const categoriasValidator = require('../validators/categorias.validator.cjs');

// GET /api/categorias - Obtener todas las categorías
router.get('/', categoriasController.getAll);

// GET /api/categorias/:id - Obtener una categoría por ID
router.get('/:id', categoriasController.getById);

// POST /api/categorias - Crear nueva categoría
router.post(
  '/',
  categoriasValidator.crear,
  categoriasController.create
);

// PUT /api/categorias/:id - Actualizar categoría
router.put(
  '/:id',
  categoriasValidator.actualizar,
  categoriasController.update
);

// DELETE /api/categorias/:id - Eliminar categoría
router.delete('/:id', categoriasController.remove);

module.exports = router;