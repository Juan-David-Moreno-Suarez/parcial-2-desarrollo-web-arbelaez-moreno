const { Venta, Cliente } = require('../models/index.cjs');

// GET /api/ventas
const getAll = async (req, res, next) => {
  try {
    const ventas = await Venta.findAll({
      order: [['fecha', 'DESC']],
      include: [{
        model: Cliente,
        as: 'cliente',
        attributes: ['id', 'nombre', 'telefono', 'email']
      }]
    });
    res.json(ventas);
  } catch (error) {
    next(error);
  }
};

// GET /api/ventas/:id
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const venta = await Venta.findByPk(id, {
      include: [{
        model: Cliente,
        as: 'cliente'
      }]
    });
    
    if (!venta) {
      return res.status(404).json({ mensaje: 'Venta no encontrada' });
    }
    
    res.json(venta);
  } catch (error) {
    next(error);
  }
};

// POST /api/ventas
const create = async (req, res, next) => {
  try {
    const { fecha, clienteId, metodoPago, total, totalPagado, itemsJson } = req.body;
    
    const venta = await Venta.create({
      fecha: fecha || new Date(),
      clienteId,
      metodoPago,
      total,
      totalPagado,
      itemsJson: Array.isArray(itemsJson) ? itemsJson : JSON.parse(itemsJson)
    });
    
    // Obtener la venta con el cliente incluido
    const ventaCreada = await Venta.findByPk(venta.id, {
      include: [{
        model: Cliente,
        as: 'cliente'
      }]
    });
    
    res.status(201).json({
      mensaje: 'Venta creada exitosamente',
      venta: ventaCreada
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/ventas/:id
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fecha, clienteId, metodoPago, total, totalPagado, itemsJson } = req.body;
    
    const venta = await Venta.findByPk(id);
    
    if (!venta) {
      return res.status(404).json({ mensaje: 'Venta no encontrada' });
    }
    
    await venta.update({
      fecha: fecha || venta.fecha,
      clienteId: clienteId || venta.clienteId,
      metodoPago: metodoPago || venta.metodoPago,
      total: total !== undefined ? total : venta.total,
      totalPagado: totalPagado !== undefined ? totalPagado : venta.totalPagado,
      itemsJson: itemsJson ? (Array.isArray(itemsJson) ? itemsJson : JSON.parse(itemsJson)) : venta.itemsJson
    });
    
    // Obtener la venta actualizada con el cliente
    const ventaActualizada = await Venta.findByPk(id, {
      include: [{
        model: Cliente,
        as: 'cliente'
      }]
    });
    
    res.json({
      mensaje: 'Venta actualizada exitosamente',
      venta: ventaActualizada
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/ventas/:id
const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const venta = await Venta.findByPk(id);
    
    if (!venta) {
      return res.status(404).json({ mensaje: 'Venta no encontrada' });
    }
    
    await venta.destroy();
    
    res.status(204).send();
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