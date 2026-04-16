import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { safeArray, guardarProductos, guardarCarrito } from '../hooks/useLocalStorage'
import '../styles/catalogue.css'
import Navbar from '../components/Navbar'

function Catalogue() {
  const [productos, setProductos] = useState(safeArray('productos'))
  const [busqueda, setBusqueda] = useState('')
  const navigate = useNavigate();

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  function crearProductoRapido() {
    const nombre = prompt('Nombre del producto:')
    if (!nombre) return
    const descripcion = prompt('Descripción:')
    const precio = Number(prompt('Precio:'))
    if (isNaN(precio)) return alert('Precio inválido')
    const stock = Number(prompt('Stock:'))
    if (isNaN(stock)) return alert('Stock inválido')
    const imagen = prompt('URL de la imagen (deja vacío para usar una por defecto):')
      || '/img/products/tijerasroma.png'
    const categoria = prompt('Categoría del producto:')

    const nuevo = {
      id: Date.now(),
      nombre,
      descripcion,
      precio,
      imagen,
      proveedor: 'interno',
      categoria,
      stock
    }

    const nuevos = [...productos, nuevo]
    setProductos(nuevos)
    guardarProductos(nuevos)
  }

  function editarProducto(id) {
    const producto = productos.find(p => p.id === id)
    if (!producto) return

    const nuevoNombre = prompt('Nuevo nombre:', producto.nombre)
    if (!nuevoNombre) return
    const nuevoPrecio = Number(prompt('Nuevo precio:', producto.precio))
    const nuevaDescripcion = prompt('Nueva descripción:', producto.descripcion)

    const nuevos = productos.map(p =>
      p.id === id
        ? { ...p, nombre: nuevoNombre, precio: nuevoPrecio, descripcion: nuevaDescripcion }
        : p
    )
    setProductos(nuevos)
    guardarProductos(nuevos)
  }

  function eliminarProducto(id) {
    const nuevos = productos.filter(p => p.id !== id)
    setProductos(nuevos)
    guardarProductos(nuevos)
  }

  function agregarAlCarrito(id) {
    const carrito = safeArray('carrito')
    const producto = productos.find(p => p.id === id)
    if (!producto) return
    const existe = carrito.find(p => p.id === id)
    if (existe) {
      existe.cantidad = (existe.cantidad || 1) + 1
    } else {
      carrito.push({ ...producto, cantidad: 1 })
    }
    guardarCarrito(carrito)
  }

  return (
    <main className='cat-container'>
      <header>
        <Navbar />
      </header>

      <section id="productos">
        <h1>Catálogo de productos</h1>
        <button onClick={() => navigate('/newProduct')} id="agregarProducto">
          <span>+</span>
          <span>Agregar un producto</span>
        </button>
        <section id="catalogo">
          {productosFiltrados.map(producto => (
            <article key={producto.id}>
              <img src={producto.imagen} width="100" alt={producto.nombre} />
              <h4>{producto.nombre}</h4>
              <p>{producto.descripcion}</p>
              <strong>${producto.precio}</strong>
              <section>
                <button onClick={() => agregarAlCarrito(producto.id)}>
                  <i className="fa fa-cart-plus"></i>
                  Agregar al carrito
                </button>
                <button onClick={() => editarProducto(producto.id)}>
                  <i className="fa fa-pencil-square-o"></i>
                  Editar
                </button>
                <button onClick={() => eliminarProducto(producto.id)}>
                  <i className="fa fa-trash"></i>
                  Eliminar
                </button>
              </section>
            </article>
          ))}
        </section>
      </section>
    </main>
  )
}

export default Catalogue