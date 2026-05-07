const { Compra, Proveedor } = require('../models/index.cjs');

// GET /api/compras
const getAll = async (req, res, next) => {
  try {
    const compras = await Compra.findAll({
      order: [['fecha', 'DESC']],
      include: [{
        model: Proveedor,
        as: 'proveedor',
        attributes: ['id', 'nombre', 'telefono']
      }]
    });
    res.json(compras);
  } catch (error) {
    next(error);
  }
};

// GET /api/compras/:id
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const compra = await Compra.findByPk(id, {
      include: [{
        model: Proveedor,
        as: 'proveedor'
      }]
    });
    
    if (!compra) {
      return res.status(404).json({ mensaje: 'Compra no encontrada' });
    }
    
    res.json(compra);
  } catch (error) {
    next(error);
  }
};

// POST /api/compras
const create = async (req, res, next) => {
  try {
    const { fecha, proveedorId, total, itemsJson } = req.body;
    
    const compra = await Compra.create({
      fecha: fecha || new Date(),
      proveedorId,
      total,
      itemsJson: Array.isArray(itemsJson) ? itemsJson : JSON.parse(itemsJson)
    });
    
    // Obtener la compra con el proveedor incluido
    const compraCreada = await Compra.findByPk(compra.id, {
      include: [{
        model: Proveedor,
        as: 'proveedor'
      }]
    });
    
    res.status(201).json({
      mensaje: 'Compra creada exitosamente',
      compra: compraCreada
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/compras/:id
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fecha, proveedorId, total, itemsJson } = req.body;
    
    const compra = await Compra.findByPk(id);
    
    if (!compra) {
      return res.status(404).json({ mensaje: 'Compra no encontrada' });
    }
    
    await compra.update({
      fecha: fecha || compra.fecha,
      proveedorId: proveedorId || compra.proveedorId,
      total: total !== undefined ? total : compra.total,
      itemsJson: itemsJson ? (Array.isArray(itemsJson) ? itemsJson : JSON.parse(itemsJson)) : compra.itemsJson
    });
    
    // Obtener la compra actualizada con el proveedor
    const compraActualizada = await Compra.findByPk(id, {
      include: [{
        model: Proveedor,
        as: 'proveedor'
      }]
    });
    
    res.json({
      mensaje: 'Compra actualizada exitosamente',
      compra: compraActualizada
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/compras/:id
const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const compra = await Compra.findByPk(id);
    
    if (!compra) {
      return res.status(404).json({ mensaje: 'Compra no encontrada' });
    }
    
    await compra.destroy();
    
    res.json({ mensaje: 'Compra eliminada exitosamente' });
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