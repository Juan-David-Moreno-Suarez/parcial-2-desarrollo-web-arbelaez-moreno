const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Middlewares
const requestLogger = require('./middlewares/requestLogger.cjs');
const sanitizeIds = require('./middlewares/sanitizeIds.cjs');
const errorHandler = require('./middlewares/errorHandler.cjs');

// Rutas
const categoriasRoutes = require('./routes/categorias.cjs');
const productosRoutes = require('./routes/productos.cjs');
const clientesRoutes = require('./routes/clientes.cjs');
const proveedoresRoutes = require('./routes/proveedores.cjs');
const ventasRoutes = require('./routes/ventas.cjs');
const comprasRoutes = require('./routes/compras.cjs');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== MIDDLEWARES GLOBALES  ==========

// 1. CORS (permitir peticiones desde el frontend)
app.use(cors({
  origin: 'http://localhost:5173'
}));

// 2. Parser de JSON
app.use(express.json());

// 3. PRE-FILTER: Logger de peticiones
app.use(requestLogger);

// 4. POST-FILTER: Sanitizar IDs
app.use(sanitizeIds);

// ========== RUTAS ==========

app.use('/api/categorias', categoriasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/compras', comprasRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API funcionando' });
});

// ========== MIDDLEWARE DE ERRORES  ==========

app.use(errorHandler);

// ========== INICIAR SERVIDOR ==========

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});

module.exports = app;