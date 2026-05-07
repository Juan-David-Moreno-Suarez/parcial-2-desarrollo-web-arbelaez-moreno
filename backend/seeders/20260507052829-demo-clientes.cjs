const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface) {
    const clientes = Array.from({ length: 15 }).map(() => ({
      nombre: faker.person.fullName(),
      telefono: faker.phone.number('### ### ####'),
      email: faker.internet.email(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('Clientes', clientes);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Clientes', null, {});
  },
};