import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { safeArray, guardarProductos, guardarCarrito } from '../hooks/useLocalStorage'
import '../styles/catalogue.css'
import Navbar from '../components/Navbar'
import { deleteResource, fetchResource } from '../services/api'
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

function Catalogue() {
  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [confirmandoId, setConfirmandoId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const navigate = useNavigate();
  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  async function cargarProductos() {
    const data = await fetchResource(1)
    setProductos(data)
    setLoading(false)
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  function editarProducto(id) {
    navigate(`/editProduct/${id}`)
  }

  async function eliminarProducto(id, name) {
    setLoadingDelete(true)
    await deleteResource(1, id)
    await cargarProductos()
    setConfirmandoId(null)
    setLoadingDelete(false)
    Toastify({
      text: `Se ha eliminado el producto ${name}`,
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'center',
      stopOnFocus: true,
      style: {
        background: 'linear-gradient(to right, #7922ca, #8d50dd)',
      }
    }).showToast()

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
          {loading ? "Cargando..." :
            productosFiltrados.map(producto => (
              <article key={producto.id}>
                <img src={producto.imagen || '/img/logo.png'} width="100" alt={producto.nombre} />
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
                  {confirmandoId === producto.id ? (
                    <section className="confirmar-eliminar">
                      <span>¿Eliminar?</span>
                      <button disabled={loadingDelete} onClick={() => eliminarProducto(producto.id, producto.nombre)}>{loadingDelete ? "Cargando" : "Sí"}</button>
                      <button disabled={loadingDelete} onClick={() => setConfirmandoId(null)}>No</button>
                    </section>
                  ) : (
                    <button onClick={() => setConfirmandoId(producto.id)}>
                      <i className="fa fa-trash"></i>
                      Eliminar
                    </button>
                  )}
                </section>
              </article>
            ))}
        </section>
      </section>
    </main>
  )
}

export default Catalogue