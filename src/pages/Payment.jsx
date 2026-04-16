import { useNavigate } from 'react-router-dom'
import { safeArray, guardarTodo } from '../hooks/useLocalStorage'
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import '../styles/payment.css'

function Payment() {

    const navigate = useNavigate()
    const carrito = safeArray('carrito')
    const productos = safeArray('productos')

    const total = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0)

    function finalizarVenta() {

        if (carrito.length === 0) {
            Toastify({
                text: 'El carrito está vacío',
                duration: 2000,
                style: { background: '#ca222a' }
            }).showToast()
            return
        }

        // 🔥 validar stock
        for (let item of carrito) {
            const producto = productos.find(p => p.id === item.id)
            if (!producto || producto.stock < item.cantidad) {
                Toastify({
                    text: `Stock insuficiente para ${item.nombre}`,
                    duration: 3000,
                    style: { background: '#ca222a' }
                }).showToast()
                return
            }
        }

        // 🔥 método de pago mejorado
        const metodo = prompt('1. Efectivo\n2. Nequi\n3. Debe')

        if (!['1', '2', '3'].includes(metodo)) {
            Toastify({
                text: 'Método inválido',
                duration: 2000,
                style: { background: '#ca222a' }
            }).showToast()
            return
        }

        const metodoPago =
            metodo === '1' ? 'Efectivo' :
            metodo === '2' ? 'Nequi' :
            'Debe'

        // 🔥 actualizar stock
        const productosActualizados = productos.map(p => {
            const item = carrito.find(i => i.id === p.id)
            if (item) {
                return {
                    ...p,
                    stock: Number(p.stock) - Number(item.cantidad)
                }
            }
            return p
        })

        // 🔥 historial de ventas
        const ventas = safeArray('ventas')

        const nuevaVenta = {
            id: crypto.randomUUID(),
            items: carrito.map(i => ({
                id: i.id,
                nombre: i.nombre,
                cantidad: i.cantidad,
                precio: i.precio,
                imagen: i.imagen
            })),
            total,
            metodoPago,
            fecha: new Date().toLocaleString()
        }

        ventas.push(nuevaVenta)

        // 🔥 guardar todo
        guardarTodo({
            productos: productosActualizados,
            carrito: [],
            ventas
        })

        Toastify({
            text: 'Venta registrada ✔ (click para ver historial)',
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'center',
            style: {
                background: 'linear-gradient(to right, #7c3aed, #a855f7)',
            },
            onClick: () => navigate('/salehistory')
        }).showToast()
    }

    return (
        <div id="payment">

            <h1>Pago</h1>

            <p>Total a pagar: ${total}</p>

            <button onClick={finalizarVenta}>
                Confirmar pago
            </button>

            <button onClick={() => navigate('/cart')}>
                Volver
            </button>

        </div>
    )
}

export default Payment