import { useState, useEffect } from 'react'
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
    const [clientes, setClientes] = useState([])
    const [selectedCliente, setSelectedCliente] = useState('')

    const total = carrito.reduce((s, i) => s + Number(i.precio) * i.cantidad, 0)

    useEffect(() => {
        fetchResource(4).then(setClientes).catch(() => setClientes([]))
    }, [])

    function pedirEfectivo() {
        return new Promise((resolve, reject) => {

            const container = document.createElement('div')

            container.innerHTML = `
                <div style="display:flex;flex-direction:column;gap:10px">
                    <span>Total: $${total.toLocaleString()}</span>
                    <input id="cashInput" type="number" placeholder="Con cuánto paga" style="padding:8px;border-radius:6px;border:none"/>
                    <div style="display:flex;gap:10px;justify-content:center">
                        <button id="confirmBtn">Confirmar</button>
                        <button id="cancelBtn">Cancelar</button>
                    </div>
                </div>
            `

            const toast = Toastify({
                node: container,
                duration: -1,
                gravity: 'top',
                position: 'center',
                close: false,
                stopOnFocus: true,
                style: { background: '#1a1a1a' }
            })

            toast.showToast()

            container.querySelector('#confirmBtn').onclick = () => {
                const val = Number(container.querySelector('#cashInput').value)

                if (!val) return

                if (val < total) {
                    Toastify({
                        text: `Faltan $${(total - val).toLocaleString()}`,
                        duration: 3000,
                        style: { background: '#ca222a' }
                    }).showToast()
                    return
                }

                const cambio = val - total

                Toastify({
                    text: `Cambio: $${cambio.toLocaleString()}`,
                    duration: 3000,
                    style: { background: '#16a34a' }
                }).showToast()

                toast.hideToast()
                resolve(true)
            }

            container.querySelector('#cancelBtn').onclick = () => {
                toast.hideToast()
                reject()
            }
        })
    }

    async function finalizarVenta() {

        if (carrito.length === 0) {
            Toastify({ text: 'El carrito está vacío', duration: 2000, style: { background: '#ca222a' } }).showToast()
            return
        }

        if (!metodoPago) {
            Toastify({ text: 'Selecciona un método de pago', duration: 2000, style: { background: '#ca222a' } }).showToast()
            return
        }

        if (metodoPago === 'Efectivo') {
            try {
                await pedirEfectivo()
            } catch {
                return
            }
        }

        try {
            setLoading(true)

            let finalClienteId = selectedCliente.trim() !== ''
                ? selectedCliente.trim()
                : 'Sin cliente'

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
                clienteId: finalClienteId,
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
        <main id="payment">
            <h1>Pago</h1>

            <p>Total a pagar: <strong>${total.toLocaleString()}</strong></p>

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

            <section id="cliente">
                <h4>Cliente (opcional)</h4>
                <select
                    value={selectedCliente}
                    onChange={(e) => setSelectedCliente(e.target.value)}
                >
                    <option value="">Selecciona un cliente</option>
                    {clientes.map((c, i) => (
                        <option key={i} value={c.id}>{c.id}</option>
                    ))}
                </select>
                <button type="button" onClick={() => navigate('/clients')}>
                    + Agregar nuevo cliente
                </button>
            </section>

            <button onClick={finalizarVenta} disabled={loading}>
                {loading ? 'Procesando...' : 'Confirmar pago'}
            </button>

            <button onClick={() => navigate(-1)} disabled={loading}>
                Volver
            </button>
        </main>
    )
}

export default Payment