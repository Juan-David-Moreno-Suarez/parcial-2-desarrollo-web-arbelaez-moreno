const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface) {
    const proveedores = Array.from({ length: 8 }).map(() => ({
      nombre: faker.company.name(),
      telefono: faker.phone.number('### ### ####'),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('Proveedors', proveedores); // Nota: Sequelize pluraliza como "Proveedors"
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Proveedors', null, {});
  },
};