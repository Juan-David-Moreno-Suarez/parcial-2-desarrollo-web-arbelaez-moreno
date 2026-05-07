const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface) {
    const compras = Array.from({ length: 12 }).map(() => {
      const items = Array.from({ length: faker.number.int({ min: 2, max: 8 }) }).map(() => ({
        productoId: faker.number.int({ min: 1, max: 16 }),
        cantidad: faker.number.int({ min: 10, max: 100 }),
        costo: parseFloat(faker.commerce.price({ min: 0.5, max: 20 })),
      }));
      
      const total = items.reduce((sum, item) => sum + (item.cantidad * item.costo), 0);
      
      return {
        fecha: faker.date.recent({ days: 60 }),
        proveedorId: faker.number.int({ min: 1, max: 8 }),
        total: total.toFixed(2),
        itemsJson: JSON.stringify(items),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    
    await queryInterface.bulkInsert('Compras', compras);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Compras', null, {});
  },
};