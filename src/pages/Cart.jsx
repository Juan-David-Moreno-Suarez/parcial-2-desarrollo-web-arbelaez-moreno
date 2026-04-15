import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { safeArray, guardarCarrito, guardarProductos } from '../hooks/useLocalStorage'
import Navbar from '../components/Navbar'
import '../styles/cart.css'

function Cart() {
    const [productos, setProductos] = useState(safeArray('productos'))
    const [carrito, setCarrito] = useState(safeArray('carrito'))
    const navigate = useNavigate()

    const total = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0)

    function agregarAlCarrito(id) {
        const producto = productos.find(p => p.id === id)
        if (!producto || Number(producto.stock) <= 0) return

        const nuevoCarrito = [...carrito]
        const item = nuevoCarrito.find(i => i.id === id)

        if (item) {
            if (item.cantidad < producto.stock) item.cantidad++
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
        const producto = productos.find(p => p.id === id)
        let nuevoCarrito = carrito.map(i => {
            if (i.id !== id) return i
            const nuevaCantidad = i.cantidad + delta
            return { ...i, cantidad: nuevaCantidad }
        })

        nuevoCarrito = nuevoCarrito.filter(i => {
            if (i.id !== id) return true
            const prod = productos.find(p => p.id === i.id)
            return i.cantidad > 0 && prod && i.cantidad <= prod.stock
        })

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
                        {productos.map(producto => (
                            <article key={producto.id}>
                                <img src={producto.imagen} width="100" alt={producto.nombre} />
                                <h4>{producto.nombre}</h4>
                                <p>{producto.descripcion}</p>
                                <strong>${producto.precio}</strong>
                                <button onClick={() => agregarAlCarrito(producto.id)}>
                                    <i className="fa fa-cart-plus"></i>
                                    Agregar al carrito
                                </button>
                            </article>
                        ))}
                    </section>
                </article>
                <article>
                    <h2>Carrito</h2>
                    <section id="carrito">
                        {carrito.length === 0 ? (
                            <p>El carrito está vacío</p>
                        ) : (
                            carrito.map(item => {
                                const producto = productos.find(p => p.id === item.id)
                                const subtotal = item.precio * item.cantidad
                                return (
                                    <article key={item.id} className="carrito-item">
                                        <img src={producto?.imagen} alt={item.nombre} />
                                        <div className="carrito-info">
                                            <h4>{item.nombre}</h4>
                                            <p>C/U: ${item.precio}</p>
                                            <p><strong>Subtotal: ${subtotal}</strong></p>
                                        </div>
                                        <div className="carrito-controls">
                                            <button onClick={() => cambiarCantidad(item.id, -1)}>−</button>
                                            <span>{item.cantidad}</span>
                                            <button onClick={() => cambiarCantidad(item.id, 1)}>+</button>
                                            <button onClick={() => eliminarItem(item.id)}>🗑</button>
                                        </div>
                                    </article>
                                )
                            })
                        )}
                    </section>
                    <h3>Total: ${total}</h3>
                    <button onClick={() => navigate('/payment')}>Ir a pago</button>
                </article>
            </main>
        </main>
    )
}

export default Cart