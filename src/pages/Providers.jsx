import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    fetchResource,
    updateResource,
    deleteResource
} from '../services/api'

import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

export default function OpenSales() {

    const navigate = useNavigate()

    const [ventas, setVentas] = useState([])
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState({})
    const [metodos, setMetodos] = useState({})
    const [processingId, setProcessingId] = useState(null)

    useEffect(() => {
        cargarVentas()
    }, [])

    async function cargarVentas() {

        try {

            setLoading(true)

            const data = await fetchResource(2)

            const abiertas = data.filter(
                v => v.metodoPago === 'Abierta'
            )

            setVentas(abiertas)

        } catch {

            setVentas([])

        } finally {

            setLoading(false)
        }
    }

    function parseItems(v) {

        try {

            if (Array.isArray(v.itemsJson)) {
                return v.itemsJson
            }

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

        if (processingId) return

        try {

            setProcessingId(v.id)

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

            setVentas(prev =>
                prev.filter(x => x.id !== v.id)
            )

        } catch {

            Toastify({
                text: 'Error al cancelar venta',
                duration: 3000,
                style: {
                    background: '#ca222a'
                }
            }).showToast()

        } finally {

            setProcessingId(null)
        }
    }

    async function cerrarVenta(v) {

        if (processingId) return

        const metodoPago = metodos[v.id]

        if (!metodoPago) {

            Toastify({
                text: 'Selecciona método de pago',
                duration: 2000,
                style: {
                    background: '#ca222a'
                }
            }).showToast()

            return
        }

        try {

            setProcessingId(v.id)

            await updateResource(2, {
                ...v,
                metodoPago,
                totalPagado: v.total,
                vueltas: 0
            })

            setVentas(prev =>
                prev.filter(x => x.id !== v.id)
            )

        } catch {

            Toastify({
                text: 'Error al cerrar venta',
                duration: 2000,
                style: {
                    background: '#ca222a'
                }
            }).showToast()

        } finally {

            setProcessingId(null)
        }
    }

    if (loading) {

        return (
            <main
                style={{
                    minHeight: '100vh',
                    background: '#050505',
                    color: 'white',
                    padding: '30px'
                }}
            >
                <p>Cargando...</p>
            </main>
        )
    }

    return (

        <main
            style={{
                minHeight: '100vh',
                background: '#050505',
                color: 'white',
                padding: '30px'
            }}
        >

            {/* HEADER */}
            <header
                style={{
                    marginBottom: '30px'
                }}
            >

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: '#161616',
                        border: '1px solid #2b2b2b',
                        color: 'white',
                        padding: '12px 18px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >

                    <i
                        className="fa fa-arrow-left"
                        aria-hidden="true"
                    ></i>

                    <span>Volver</span>

                </button>

            </header>

            <h1
                style={{
                    marginBottom: '25px',
                    fontSize: '38px'
                }}
            >
                Ventas abiertas
            </h1>

            {ventas.length === 0 ? (

                <div
                    style={{
                        background: '#141414',
                        border: '1px solid #242424',
                        borderRadius: '18px',
                        padding: '30px',
                        maxWidth: '400px',
                        color: '#bdbdbd'
                    }}
                >
                    No hay ventas abiertas
                </div>

            ) : (

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                    }}
                >

                    {ventas.map(v => {

                        const items = parseItems(v)

                        return (

                            <section
                                key={v.id}
                                style={{
                                    background: '#121212',
                                    border: '1px solid #2a2a2a',
                                    borderLeft: '5px solid #7c3aed',
                                    borderRadius: '18px',
                                    padding: '22px'
                                }}
                            >

                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        gap: '15px'
                                    }}
                                >

                                    <div>

                                        <p
                                            style={{
                                                color: '#9f9f9f',
                                                marginBottom: '8px'
                                            }}
                                        >
                                            {v.fecha}
                                        </p>

                                        <h2
                                            style={{
                                                fontSize: '28px',
                                                marginBottom: '10px'
                                            }}
                                        >
                                            ${Number(v.total).toLocaleString()}
                                        </h2>

                                        <p
                                            style={{
                                                color: '#c7c7c7'
                                            }}
                                        >
                                            Cliente: {v.clienteId || 'Sin cliente'}
                                        </p>

                                    </div>

                                    <button
                                        onClick={() => toggle(v.id)}
                                        style={{
                                            background: '#7c3aed',
                                            border: 'none',
                                            color: 'white',
                                            padding: '12px 18px',
                                            borderRadius: '12px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {expanded[v.id]
                                            ? 'Ocultar'
                                            : 'Ver detalles'}
                                    </button>

                                </div>

                                {expanded[v.id] && (

                                    <div
                                        style={{
                                            marginTop: '25px'
                                        }}
                                    >

                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '10px',
                                                marginBottom: '25px'
                                            }}
                                        >

                                            {items.map((i, index) => (

                                                <div
                                                    key={index}
                                                    style={{
                                                        background: '#1b1b1b',
                                                        padding: '14px',
                                                        borderRadius: '12px',
                                                        color: '#f2f2f2'
                                                    }}
                                                >
                                                    {i.nombre} x{i.cantidad}
                                                </div>

                                            ))}

                                        </div>

                                        <h3
                                            style={{
                                                marginBottom: '15px'
                                            }}
                                        >
                                            Método de pago
                                        </h3>

                                        <div
                                            style={{
                                                display: 'flex',
                                                gap: '12px',
                                                flexWrap: 'wrap',
                                                marginBottom: '25px'
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
                                                                    : '#222',
                                                            color: 'white',
                                                            border: '1px solid #333',
                                                            padding: '12px 18px',
                                                            borderRadius: '12px',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {m}
                                                    </button>

                                                ))}

                                        </div>

                                        <div
                                            style={{
                                                display: 'flex',
                                                gap: '12px',
                                                flexWrap: 'wrap'
                                            }}
                                        >

                                            <button
                                                disabled={processingId === v.id}
                                                onClick={() => cerrarVenta(v)}
                                                style={{
                                                    background: '#7c3aed',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '14px 20px',
                                                    borderRadius: '12px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Finalizar pago
                                            </button>

                                            <button
                                                disabled={processingId === v.id}
                                                onClick={() => cancelarVenta(v)}
                                                style={{
                                                    background: '#2a1212',
                                                    color: '#ff9d9d',
                                                    border: '1px solid #4d1f1f',
                                                    padding: '14px 20px',
                                                    borderRadius: '12px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Cancelar venta
                                            </button>

                                        </div>

                                    </div>

                                )}

                            </section>
                        )
                    })}

                </div>

            )}

        </main>
    )
}