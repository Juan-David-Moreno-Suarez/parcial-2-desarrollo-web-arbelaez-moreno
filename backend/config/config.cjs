require('dotenv').config();

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: './backend/database.sqlite', // ← Ruta actualizada
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
  },
  production: {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
};