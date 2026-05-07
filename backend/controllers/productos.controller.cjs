const { Producto, Categoria } = require('../models/index.cjs');
const { Op } = require('sequelize');

// GET /api/productos
const getAll = async (req, res, next) => {
  try {
    const productos = await Producto.findAll({
      order: [['nombre', 'ASC']],
      include: [{
        model: Categoria,
        as: 'categoria',
        attributes: ['id', 'nombre']
      }]
    });
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

// GET /api/productos/:id
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const producto = await Producto.findByPk(id, {
      include: [{
        model: Categoria,
        as: 'categoria'
      }]
    });
    
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    res.json(producto);
  } catch (error) {
    next(error);
  }
};

// POST /api/productos
const create = async (req, res, next) => {
  try {
    const { nombre, categoriaId, descripcion, precio, costo, stock, imagen } = req.body;
    
    // Verificar si ya existe un producto con el mismo nombre
    const existe = await Producto.findOne({
      where: {
        nombre: {
          [Op.like]: nombre.trim()
        }
      }
    });
    
    if (existe) {
      return res.status(400).json({ mensaje: 'Ya existe un producto con ese nombre' });
    }
    
    const producto = await Producto.create({
      nombre: nombre.trim(),
      categoriaId,
      descripcion: descripcion?.trim() || null,
      precio,
      costo,
      stock,
      imagen: imagen?.trim() || null
    });
    
    // Obtener el producto con la categoría incluida
    const productoCreado = await Producto.findByPk(producto.id, {
      include: [{
        model: Categoria,
        as: 'categoria'
      }]
    });
    
    res.status(201).json({
      mensaje: 'Producto creado exitosamente',
      producto: productoCreado
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/productos/:id
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, categoriaId, descripcion, precio, costo, stock, imagen } = req.body;
    
    const producto = await Producto.findByPk(id);
    
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    // Si se actualiza el nombre, verificar que no exista otro producto con ese nombre
    if (nombre && nombre.trim() !== producto.nombre) {
      const existe = await Producto.findOne({
        where: {
          nombre: {
            [Op.like]: nombre.trim()
          },
          id: { [Op.ne]: id }
        }
      });
      
      if (existe) {
        return res.status(400).json({ mensaje: 'Ya existe un producto con ese nombre' });
      }
    }
    
    await producto.update({
      nombre: nombre?.trim() || producto.nombre,
      categoriaId: categoriaId || producto.categoriaId,
      descripcion: descripcion?.trim() || producto.descripcion,
      precio: precio !== undefined ? precio : producto.precio,
      costo: costo !== undefined ? costo : producto.costo,
      stock: stock !== undefined ? stock : producto.stock,
      imagen: imagen?.trim() || producto.imagen
    });
    
    // Obtener el producto actualizado con la categoría
    const productoActualizado = await Producto.findByPk(id, {
      include: [{
        model: Categoria,
        as: 'categoria'
      }]
    });
    
    res.json({
      mensaje: 'Producto actualizado exitosamente',
      producto: productoActualizado
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/productos/:id
const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const producto = await Producto.findByPk(id);
    
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    await producto.destroy();
    
    res.json({ mensaje: 'Producto eliminado exitosamente' });
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