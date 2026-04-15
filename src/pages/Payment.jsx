import { useState } from 'react'
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
        if (carrito.length === 0) return

        const metodo = prompt('1.Efectivo  2.Nequi  3.Debe')
        const metodoPago =
            metodo === '1' ? 'Efectivo' :
                metodo === '2' ? 'Nequi' :
                    'Debe'

        const productosActualizados = productos.map(p => {
            const item = carrito.find(i => i.id === p.id)
            if (item) return { ...p, stock: p.stock - item.cantidad }
            return p
        })

        const ventas = safeArray('ventas')
        ventas.push({
            id: Date.now(),
            items: [...carrito],
            total,
            metodoPago,
            fecha: new Date().toLocaleString()
        })

        guardarTodo({
            productos: productosActualizados,
            carrito: [],
            ventas
        })

        Toastify({
            text: 'Venta registrada, haz click para ver historial',
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'center',
            stopOnFocus: true,
            style: {
                background: 'linear-gradient(to right, #225dca, #7b50dd)',
            },
            onClick: () => navigate('/salehistory')
        }).showToast()
    }

    return (
        <div id="payment">
            <h1>Pago</h1>
            <p>Total a pagar: ${total}</p>
            <button onClick={finalizarVenta}>Confirmar pago</button>
            <button onClick={() => navigate('/cart')}>Volver</button>
        </div>
    )
}

export default Payment