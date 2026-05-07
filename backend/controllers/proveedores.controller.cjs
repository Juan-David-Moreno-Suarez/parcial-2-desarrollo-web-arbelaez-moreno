const { Proveedor, Compra } = require('../models/index.cjs');
const { Op } = require('sequelize');

// GET /api/proveedores
const getAll = async (req, res, next) => {
  try {
    const proveedores = await Proveedor.findAll({
      order: [['nombre', 'ASC']],
      include: [{
        model: Compra,
        as: 'compras',
        attributes: ['id', 'fecha', 'total']
      }]
    });
    res.json(proveedores);
  } catch (error) {
    next(error);
  }
};

// GET /api/proveedores/:id
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const proveedor = await Proveedor.findByPk(id, {
      include: [{
        model: Compra,
        as: 'compras',
        order: [['fecha', 'DESC']]
      }]
    });
    
    if (!proveedor) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }
    
    res.json(proveedor);
  } catch (error) {
    next(error);
  }
};

// POST /api/proveedores
const create = async (req, res, next) => {
  try {
    const { nombre, telefono } = req.body;
    
    // Verificar si ya existe un proveedor con el mismo nombre
    const existe = await Proveedor.findOne({
      where: {
        nombre: {
          [Op.like]: nombre.trim()
        }
      }
    });
    
    if (existe) {
      return res.status(400).json({ mensaje: 'Ya existe un proveedor con ese nombre' });
    }
    
    const proveedor = await Proveedor.create({
      nombre: nombre.trim(),
      telefono: telefono?.trim() || null
    });
    
    res.status(201).json({
      mensaje: 'Proveedor creado exitosamente',
      proveedor
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/proveedores/:id
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, telefono } = req.body;
    
    const proveedor = await Proveedor.findByPk(id);
    
    if (!proveedor) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }
    
    // Si se actualiza el nombre, verificar que no exista otro proveedor con ese nombre
    if (nombre && nombre.trim() !== proveedor.nombre) {
      const existe = await Proveedor.findOne({
        where: {
          nombre: {
            [Op.like]: nombre.trim()
          },
          id: { [Op.ne]: id }
        }
      });
      
      if (existe) {
        return res.status(400).json({ mensaje: 'Ya existe un proveedor con ese nombre' });
      }
    }
    
    await proveedor.update({
      nombre: nombre?.trim() || proveedor.nombre,
      telefono: telefono?.trim() || proveedor.telefono
    });
    
    res.json({
      mensaje: 'Proveedor actualizado exitosamente',
      proveedor
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/proveedores/:id
const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const proveedor = await Proveedor.findByPk(id);
    
    if (!proveedor) {
      return res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }
    
    // Verificar si tiene compras asociadas
    const comprasCount = await Compra.count({
      where: { proveedorId: id }
    });
    
    if (comprasCount > 0) {
      return res.status(400).json({ 
        mensaje: `No se puede eliminar. Este proveedor tiene ${comprasCount} compra(s) asociada(s)` 
      });
    }
    
    await proveedor.destroy();
    
    res.json({ mensaje: 'Proveedor eliminado exitosamente' });
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