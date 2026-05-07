const { Categoria, Producto } = require('../models/index.cjs');
const { Op } = require('sequelize');

// GET /api/categorias
const getAll = async (req, res, next) => {
  try {
    const categorias = await Categoria.findAll({
      order: [['nombre', 'ASC']],
      include: [{
        model: Producto,
        as: 'productos',
        attributes: ['id', 'nombre']
      }]
    });
    res.json(categorias);
  } catch (error) {
    next(error);
  }
};

// GET /api/categorias/:id
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const categoria = await Categoria.findByPk(id, {
      include: [{
        model: Producto,
        as: 'productos'
      }]
    });
    
    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    
    res.json(categoria);
  } catch (error) {
    next(error);
  }
};

// POST /api/categorias
const create = async (req, res, next) => {
  try {
    const { nombre } = req.body;
    
    // Verificar si ya existe (case insensitive)
    const existe = await Categoria.findOne({
      where: {
        nombre: {
          [Op.like]: nombre.trim()
        }
      }
    });
    
    if (existe) {
      return res.status(400).json({ mensaje: 'Esta categoría ya existe' });
    }
    
    const categoria = await Categoria.create({ 
      nombre: nombre.trim() 
    });
    
    res.status(201).json({
      mensaje: 'Categoría creada exitosamente',
      categoria
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/categorias/:id
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    
    const categoria = await Categoria.findByPk(id);
    
    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    
    // Verificar si el nuevo nombre ya existe (excepto el actual)
    const existe = await Categoria.findOne({
      where: { 
        nombre: {
          [Op.like]: nombre.trim()
        },
        id: { [Op.ne]: id }
      }
    });
    
    if (existe) {
      return res.status(400).json({ mensaje: 'Ya existe una categoría con ese nombre' });
    }
    
    await categoria.update({ nombre: nombre.trim() });
    
    res.json({
      mensaje: 'Categoría actualizada exitosamente',
      categoria
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/categorias/:id
const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const categoria = await Categoria.findByPk(id);
    
    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    
    // Verificar si tiene productos asociados
    const productosCount = await Producto.count({
      where: { categoriaId: id }
    });
    
    if (productosCount > 0) {
      return res.status(400).json({ 
        mensaje: `No se puede eliminar. Esta categoría tiene ${productosCount} producto(s) asociado(s)` 
      });
    }
    
    await categoria.destroy();
    
    res.json({ mensaje: 'Categoría eliminada exitosamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};