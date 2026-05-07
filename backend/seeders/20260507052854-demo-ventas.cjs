const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface) {
    const ventas = Array.from({ length: 20 }).map(() => {
      const items = Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(() => ({
        productoId: faker.number.int({ min: 1, max: 16 }),
        cantidad: faker.number.int({ min: 1, max: 10 }),
        precio: parseFloat(faker.commerce.price({ min: 1, max: 50 })),
      }));
      
      const total = items.reduce((sum, item) => sum + (item.cantidad * item.precio), 0);
      
      return {
        fecha: faker.date.recent({ days: 30 }),
        clienteId: faker.number.int({ min: 1, max: 15 }),
        metodoPago: faker.helpers.arrayElement(['efectivo', 'tarjeta', 'transferencia', 'nequi']),
        total: total.toFixed(2),
        totalPagado: total.toFixed(2),
        itemsJson: JSON.stringify(items),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    
    await queryInterface.bulkInsert('Ventas', ventas);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Ventas', null, {});
  },
};