const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface) {
    const categorias = [
      { nombre: 'Útiles Escolares', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Papelería Oficina', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Arte y Manualidades', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Cuadernos y Libretas', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Escritura', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Organización', createdAt: new Date(), updatedAt: new Date() },
    ];
    await queryInterface.bulkInsert('Categorias', categorias);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Categorias', null, {});
  },
};