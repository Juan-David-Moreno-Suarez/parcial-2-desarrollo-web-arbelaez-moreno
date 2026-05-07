const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface) {
    const productos = [
      // Útiles Escolares (categoriaId: 1)
      { nombre: 'Lápiz HB', categoriaId: 1, descripcion: 'Lápiz de grafito estándar', precio: 1.50, costo: 0.80, stock: 150, imagen: 'lapiz.jpg', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Borrador blanco', categoriaId: 1, descripcion: 'Borrador suave', precio: 1.00, costo: 0.50, stock: 200, imagen: 'borrador.jpg', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Sacapuntas metálico', categoriaId: 1, descripcion: 'Sacapuntas doble', precio: 2.50, costo: 1.20, stock: 100, imagen: 'sacapuntas.jpg', createdAt: new Date(), updatedAt: new Date() },
      
      // Papelería Oficina (categoriaId: 2)
      { nombre: 'Resma papel carta', categoriaId: 2, descripcion: 'Resma 500 hojas blancas', precio: 15.00, costo: 10.00, stock: 50, imagen: 'resma.jpg', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Clips pequeños caja x100', categoriaId: 2, descripcion: 'Clips metálicos', precio: 2.00, costo: 1.00, stock: 80, imagen: 'clips.jpg', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Grapadora metálica', categoriaId: 2, descripcion: 'Grapadora para 20 hojas', precio: 12.00, costo: 7.00, stock: 30, imagen: 'grapadora.jpg', createdAt: new Date(), updatedAt: new Date() },
      
      // Arte y Manualidades (categoriaId: 3)
      { nombre: 'Crayones x12', categoriaId: 3, descripcion: 'Set de 12 colores', precio: 5.00, costo: 3.00, stock: 60, imagen: 'crayones.jpg', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Témperas x6', categoriaId: 3, descripcion: 'Pintura témpera colores básicos', precio: 8.50, costo: 5.00, stock: 40, imagen: 'temperas.jpg', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Pinceles set x3', categoriaId: 3, descripcion: 'Pinceles de diferentes tamaños', precio: 6.00, costo: 3.50, stock: 45, imagen: 'pinceles.jpg', createdAt: new Date(), updatedAt: new Date() },
      
      // Cuadernos (categoriaId: 4)
      { nombre: 'Cuaderno 100 hojas cuadriculado', categoriaId: 4, descripcion: 'Cuaderno universitario', precio: 4.50, costo: 2.50, stock: 120, imagen: 'cuaderno.jpg', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Cuaderno 50 hojas rayado', categoriaId: 4, descripcion: 'Cuaderno pequeño', precio: 2.50, costo: 1.50, stock: 150, imagen: 'cuaderno-pequeno.jpg', createdAt: new Date(), updatedAt: new Date() },
      
      // Escritura (categoriaId: 5)
      { nombre: 'Bolígrafo azul', categoriaId: 5, descripcion: 'Bolígrafo tinta azul', precio: 1.50, costo: 0.70, stock: 200, imagen: 'boligrafo.jpg', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Marcador permanente negro', categoriaId: 5, descripcion: 'Marcador punta fina', precio: 3.00, costo: 1.80, stock: 90, imagen: 'marcador.jpg', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Resaltador amarillo', categoriaId: 5, descripcion: 'Marcador fluorescente', precio: 2.50, costo: 1.30, stock: 110, imagen: 'resaltador.jpg', createdAt: new Date(), updatedAt: new Date() },
      
      // Organización (categoriaId: 6)
      { nombre: 'Carpeta plástica con ganchos', categoriaId: 6, descripcion: 'Carpeta tamaño carta', precio: 3.50, costo: 2.00, stock: 70, imagen: 'carpeta.jpg', createdAt: new Date(), updatedAt: new Date() },
      { nombre: 'Archivador de palanca', categoriaId: 6, descripcion: 'Archivador tamaño oficio', precio: 8.00, costo: 5.00, stock: 35, imagen: 'archivador.jpg', createdAt: new Date(), updatedAt: new Date() },
    ];
    await queryInterface.bulkInsert('Productos', productos);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Productos', null, {});
  },
};