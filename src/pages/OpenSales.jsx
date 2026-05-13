import { useEffect, useState } from 'react'
import { fetchResource, updateResource, deleteResource } from '../services/api'
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

export default function OpenSales() {

    const [ventas, setVentas] = useState([])
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState({})
    const [metodos, setMetodos] = useState({})

    useEffect(() => {
        cargarVentas()
    }, [])

    async function cargarVentas() {

        try {

            setLoading(true)

            const data = await fetchResource(2)

            setVentas(
                data.filter(v => v.estado === 'abierta')
            )

        } finally {
            setLoading(false)
        }
    }

    function parseItems(v) {

        try {
            return JSON.parse(v.itemsJson)
        } catch {
            return []
        }
    }

    function toggle(id) {
        setExpanded(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    async function cancelarVenta(v) {

        try {

            const productos = await fetchResource(1)
            const items = parseItems(v)

            for (let item of items) {

                const producto = productos.find(
                    p => p.id === item.id
                )

                if (!producto) continue

                await updateResource(1, {
                    ...producto,
                    stock:
                        Number(producto.stock) +
                        Number(item.cantidad)
                })
            }

            await deleteResource(2, v.id)

            Toastify({
                text: 'Venta abierta cancelada',
                duration: 3000,
                style: { background: '#ca222a' }
            }).showToast()

            cargarVentas()

        } catch {

            Toastify({
                text: 'Error al cancelar',
                duration: 3000,
                style: { background: '#ca222a' }
            }).showToast()
        }
    }

    async function cerrarVenta(v) {

        const metodoPago = metodos[v.id]

        if (!metodoPago) {

            Toastify({
                text: 'Selecciona método de pago',
                duration: 2000,
                style: { background: '#ca222a' }
            }).showToast()

            return
        }

        try {

            await updateResource(2, {
                ...v,
                estado: 'cerrada',
                metodoPago,
                totalPagado: v.total,
                vueltas: 0
            })

            Toastify({
                text: 'Venta cerrada ✔',
                duration: 3000,
                style: {
                    background:
                        'linear-gradient(to right, #7c3aed, #a855f7)'
                }
            }).showToast()

            cargarVentas()

        } catch {

            Toastify({
                text: 'Error al cerrar venta',
                duration: 2000,
                style: { background: '#ca222a' }
            }).showToast()
        }
    }

    if (loading) {
        return <p>Cargando...</p>
    }

    return (
        <main
            style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
            }}
        >

            <h1>Ventas abiertas</h1>

            {ventas.length === 0 ? (
                <p>No hay ventas abiertas</p>
            ) : (
                ventas.map(v => {

                    const items = parseItems(v)

                    return (
                        <section
                            key={v.id}
                            style={{
                                border: '2px solid orange',
                                borderRadius: '12px',
                                padding: '20px',
                                background: '#fff8ed'
                            }}
                        >

                            <p>
                                <strong>{v.fecha}</strong>
                            </p>

                            <p>
                                Cliente: {v.clienteId}
                            </p>

                            <p>
                                Total:
                                ${Number(v.total).toLocaleString()}
                            </p>

                            <button onClick={() => toggle(v.id)}>
                                {expanded[v.id]
                                    ? 'Ocultar'
                                    : 'Ver'}
                            </button>

                            {expanded[v.id] && (
                                <div
                                    style={{
                                        marginTop: '15px'
                                    }}
                                >

                                    {items.map((i, index) => (
                                        <p key={index}>
                                            {i.nombre} x{i.cantidad}
                                        </p>
                                    ))}

                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: '10px',
                                            marginTop: '15px',
                                            flexWrap: 'wrap'
                                        }}
                                    >

                                        {['Efectivo', 'Nequi', 'Debe']
                                            .map(m => (
                                                <button
                                                    key={m}
                                                    onClick={() =>
                                                        setMetodos(prev => ({
                                                            ...prev,
                                                            [v.id]: m
                                                        }))
                                                    }
                                                    style={{
                                                        background:
                                                            metodos[v.id] === m
                                                                ? '#7c3aed'
                                                                : '#ddd'
                                                    }}
                                                >
                                                    {m}
                                                </button>
                                            ))}

                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: '10px',
                                            marginTop: '20px'
                                        }}
                                    >

                                        <button
                                            onClick={() =>
                                                cerrarVenta(v)
                                            }
                                        >
                                            Finalizar pago
                                        </button>

                                        <button
                                            onClick={() =>
                                                cancelarVenta(v)
                                            }
                                            style={{
                                                background: '#ca222a'
                                            }}
                                        >
                                            Cancelar venta
                                        </button>

                                    </div>

                                </div>
                            )}

                        </section>
                    )
                })
            )}

        </main>
    )
}