import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { safeArray, guardarCarrito } from '../hooks/useLocalStorage'
import { fetchResource } from '../services/api'
import Navbar from '../components/Navbar'
import '../styles/cart.css'

function Cart() {
    const [productos, setProductos] = useState([])
    const [carrito, setCarrito] = useState(safeArray('carrito'))
    const [loading, setLoading] = useState(true)
    const [carritoSincronizado, setCarritoSincronizado] = useState(false)
    const [sincronizando, setSincronizando] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        async function cargarProductos() {
            const data = await fetchResource(1)
            setProductos(data.filter(p => Number(p.stock) > 0))
            setLoading(false)
        }
        cargarProductos()
    }, [])

    useEffect(() => {
        if (!loading && productos.length > 0 && !carritoSincronizado) {
            setSincronizando(true)
            sincronizarCarrito()
            setCarritoSincronizado(true)
            setSincronizando(false)
        }
    }, [loading, productos, carritoSincronizado])

    function sincronizarCarrito() {
        const nuevoCarrito = carrito.map(item => {
            const prodActual = productos.find(p => p.id === item.id)
            if (prodActual) {
                return {
                    ...item,
                    precio: prodActual.precio, // Actualizar precio
                    stockDisponible: Number(prodActual.stock),
                    insuficiente: item.cantidad > Number(prodActual.stock)
                }
            }
            return item
        }).filter(item => {
            const prodActual = productos.find(p => p.id === item.id)
            return prodActual // Solo mantener si el producto aún existe
        })

        setCarrito(nuevoCarrito)
        guardarCarrito(nuevoCarrito)
    }

    const total = carrito.reduce((s, i) => s + Number(i.precio) * i.cantidad, 0)

    function agregarAlCarrito(id) {
        const producto = productos.find(p => p.id === id)
        if (!producto || Number(producto.stock) <= 0) return

        const nuevoCarrito = [...carrito]
        const item = nuevoCarrito.find(i => i.id === id)

        if (item) {
            if (item.cantidad < Number(producto.stock)) item.cantidad++
        } else {
            nuevoCarrito.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: producto.imagen,
                cantidad: 1
            })
        }

        setCarrito(nuevoCarrito)
        guardarCarrito(nuevoCarrito)
    }

    function cambiarCantidad(id, delta) {
        let nuevoCarrito = carrito.map(i => {
            if (i.id !== id) return i
            const nuevaCantidad = Math.max(0, i.cantidad + delta)
            const prod = productos.find(p => p.id === i.id)
            if (delta > 0 && prod && nuevaCantidad > Number(prod.stock)) return i // No permitir aumentar si excede stock
            return { ...i, cantidad: nuevaCantidad, insuficiente: nuevaCantidad > Number(prod?.stock || 0) }
        })

        nuevoCarrito = nuevoCarrito.filter(i => i.cantidad > 0)

        setCarrito(nuevoCarrito)
        guardarCarrito(nuevoCarrito)
    }

    function eliminarItem(id) {
        const nuevoCarrito = carrito.filter(i => i.id !== id)
        setCarrito(nuevoCarrito)
        guardarCarrito(nuevoCarrito)
    }

    return (
        <main className='cart-container'>
            <header>
                <Navbar />
            </header>
            <h1>Nueva venta</h1>
            <main>
                <article>
                    <h2>Productos disponibles</h2>
                    <section id="catalogo">
                        {loading ? (
                            <p>Cargando...</p>
                        ) : productos.length === 0 ? (
                            <p>Sin productos disponibles</p>
                        ) : (
                            productos.map(producto => (
                                <article key={producto.id}>
                                    <img src={producto.imagen || '/img/logo.png'} width="100" alt={producto.nombre || 'Producto'} />
                                    <h4>{producto.nombre || 'Sin nombre'}</h4>
                                    <p>{producto.descripcion}</p>
                                    <p>Stock: {producto.stock}</p>
                                    <strong>${Number(producto.precio).toLocaleString()}</strong>
                                    <button onClick={() => agregarAlCarrito(producto.id)}>
                                        <i className="fa fa-cart-plus"></i>
                                        Agregar al carrito
                                    </button>
                                </article>
                            ))
                        )}
                    </section>
                </article>
                <article>
                    <h2>Carrito</h2>
                    <section id="carrito">
                        {carrito.length === 0 ? (
                            <p>El carrito está vacío</p>
                        ) : (
                            carrito.map(item => {
                                const subtotal = Number(item.precio) * item.cantidad
                                const prod = productos.find(p => p.id === item.id)
                                const stockActual = prod ? Number(prod.stock) : 0
                                return (
                                    <article key={item.id} className={`carrito-item ${item.insuficiente ? 'insuficiente' : ''}`}>
                                        <img src={item.imagen || '/img/logo.png'} alt={item.nombre} />
                                        <div className="carrito-info">
                                            <h4>{item.nombre}</h4>
                                            <p>C/U: ${Number(item.precio).toLocaleString()}</p>
                                            <p><strong>Subtotal: ${subtotal.toLocaleString()}</strong></p>
                                            {item.insuficiente && (
                                                <p className="error">Producto insuficiente. Stock disponible: {stockActual}. Modifica la cantidad o elimina el producto.</p>
                                            )}
                                        </div>
                                        <div className="carrito-controls">
                                            <button onClick={() => cambiarCantidad(item.id, -1)} disabled={item.cantidad <= 1}>−</button>
                                            <span>{item.cantidad}</span>
                                            <button onClick={() => cambiarCantidad(item.id, 1)} disabled={item.cantidad >= stockActual || item.insuficiente}>+</button>
                                            <button onClick={() => eliminarItem(item.id)}>🗑</button>
                                        </div>
                                    </article>
                                )
                            })
                        )}
                    </section>
                    <h3>Total: ${total.toLocaleString()}</h3>
                    {sincronizando && <p>Sincronizando carrito con base de datos...</p>}
                    {!carritoSincronizado && !sincronizando && <p>Verificando stock disponible...</p>}
                    {carrito.some(item => item.insuficiente) && (
                        <p className="error">Hay productos con stock insuficiente. Ajusta las cantidades o elimina los productos antes de proceder al pago.</p>
                    )}
                    <button onClick={() => navigate('/payment')} disabled={sincronizando || !carritoSincronizado || carrito.some(item => item.insuficiente)}>
                        Ir a pago
                    </button>
                </article>
            </main>
        </main>
    )
}

export default Cart