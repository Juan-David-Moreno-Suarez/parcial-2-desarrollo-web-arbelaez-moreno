import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { safeArray, guardarCarrito } from '../hooks/useLocalStorage'
import { fetchResource, updateResource, postResource } from '../services/api'
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import '../styles/payment.css'

function Payment() {

    const navigate = useNavigate()
    const carrito = safeArray('carrito')
    const [metodoPago, setMetodoPago] = useState('')
    const [loading, setLoading] = useState(false)

    const total = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0)

    async function finalizarVenta() {

        if (carrito.length === 0) {
            Toastify({ text: 'El carrito está vacío', duration: 2000, style: { background: '#ca222a' } }).showToast()
            return
        }

        if (!metodoPago) {
            Toastify({ text: 'Selecciona un método de pago', duration: 2000, style: { background: '#ca222a' } }).showToast()
            return
        }

        try {
            setLoading(true)

            const productos = await fetchResource(1)

            for (let item of carrito) {
                const producto = productos.find(p => p.id === item.id)
                if (!producto || Number(producto.stock) < Number(item.cantidad)) {
                    Toastify({ text: `Stock insuficiente para ${item.nombre}`, duration: 3000, style: { background: '#ca222a' } }).showToast()
                    setLoading(false)
                    return
                }
            }

            for (let item of carrito) {
                const producto = productos.find(p => p.id === item.id)
                await updateResource(1, {
                    ...producto,
                    stock: Number(producto.stock) - Number(item.cantidad)
                })
            }

            const nuevaVenta = {
                id: crypto.randomUUID(),
                itemsJson: JSON.stringify(carrito.map(i => ({
                    id: i.id,
                    nombre: i.nombre,
                    cantidad: i.cantidad,
                    precio: i.precio
                }))),
                total,
                metodoPago,
                fecha: new Date().toLocaleString()
            }
            await postResource(2, nuevaVenta)

            guardarCarrito([])

            Toastify({
                text: 'Venta registrada ✔',
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'center',
                style: { background: 'linear-gradient(to right, #7c3aed, #a855f7)' },
                onClick: () => navigate('/salehistory')
            }).showToast()

            navigate('/')

        } catch {
            Toastify({ text: 'Error al registrar la venta', duration: 2000, style: { background: '#ca222a' } }).showToast()
        } finally {
            setLoading(false)
        }
    }

    return (
        <div id="payment">
            <h1>Pago</h1>

            <p>Total a pagar: <strong>${total}</strong></p>

            <div id="metodos-pago">
                <h4>Método de pago</h4>
                {['Efectivo', 'Nequi', 'Debe'].map(m => (
                    <button
                        key={m}
                        className={metodoPago === m ? 'metodo-activo' : ''}
                        onClick={() => setMetodoPago(m)}
                        type="button"
                    >
                        {m}
                    </button>
                ))}
            </div>

            <button onClick={finalizarVenta} disabled={loading}>
                {loading ? 'Procesando...' : 'Confirmar pago'}
            </button>

            <button onClick={() => navigate('/cart')} disabled={loading}>
                Volver
            </button>
        </div>
    )
}

export default Payment