const { Cliente, Venta } = require('../models/index.cjs');
const { Op } = require('sequelize');

// GET /api/clientes
const getAll = async (req, res, next) => {
  try {
    const clientes = await Cliente.findAll({
      order: [['nombre', 'ASC']],
      include: [{
        model: Venta,
        as: 'ventas',
        attributes: ['id', 'fecha', 'total']
      }]
    });
    res.json(clientes);
  } catch (error) {
    next(error);
  }
};

// GET /api/clientes/:id
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const cliente = await Cliente.findByPk(id, {
      include: [{
        model: Venta,
        as: 'ventas',
        order: [['fecha', 'DESC']]
      }]
    });
    
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    
    res.json(cliente);
  } catch (error) {
    next(error);
  }
};

// POST /api/clientes
const create = async (req, res, next) => {
  try {
    const { nombre, telefono, email } = req.body;
    
    // Verificar si ya existe un cliente con el mismo nombre
    const existe = await Cliente.findOne({
      where: {
        nombre: {
          [Op.like]: nombre.trim()
        }
      }
    });
    
    if (existe) {
      return res.status(400).json({ mensaje: 'Ya existe un cliente con ese nombre' });
    }
    
    const cliente = await Cliente.create({
      nombre: nombre.trim(),
      telefono: telefono?.trim() || null,
      email: email?.trim() || null
    });
    
    res.status(201).json({
      mensaje: 'Cliente creado exitosamente',
      cliente
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/clientes/:id
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, email } = req.body;
    
    const cliente = await Cliente.findByPk(id);
    
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    
    // Si se actualiza el nombre, verificar que no exista otro cliente con ese nombre
    if (nombre && nombre.trim() !== cliente.nombre) {
      const existe = await Cliente.findOne({
        where: {
          nombre: {
            [Op.like]: nombre.trim()
          },
          id: { [Op.ne]: id }
        }
      });
      
      if (existe) {
        return res.status(400).json({ mensaje: 'Ya existe un cliente con ese nombre' });
      }
    }
    
    await cliente.update({
      nombre: nombre?.trim() || cliente.nombre,
      telefono: telefono?.trim() || cliente.telefono,
      email: email?.trim() || cliente.email
    });
    
    res.json({
      mensaje: 'Cliente actualizado exitosamente',
      cliente
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/clientes/:id
const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const cliente = await Cliente.findByPk(id);
    
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    
    // Verificar si tiene ventas asociadas
    const ventasCount = await Venta.count({
      where: { clienteId: id }
    });
    
    if (ventasCount > 0) {
      return res.status(400).json({ 
        mensaje: `No se puede eliminar. Este cliente tiene ${ventasCount} venta(s) asociada(s)` 
      });
    }
    
    await cliente.destroy();
    
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