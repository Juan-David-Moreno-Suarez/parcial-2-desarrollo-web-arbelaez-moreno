import { useState, useEffect } from 'react'
import { fetchResource } from '../services/api'
import Navbar from '../components/Navbar'
import '../styles/salehistory.css'

function SaleHistory() {

    const [ventas, setVentas] = useState([])
    const [compras, setCompras] = useState([])
    const [loading, setLoading] = useState(true)
    const [ventasAbiertas, setVentasAbiertas] = useState({})
    const [comprasAbiertas, setComprasAbiertas] = useState({})

    useEffect(() => {
        async function cargarHistorial() {
            const [dataVentas, dataCompras] = await Promise.all([
                fetchResource(2),
                fetchResource(3)
            ])
            setVentas(dataVentas)
            setCompras(dataCompras)
            setLoading(false)
        }
        cargarHistorial()
    }, [])

    function toggleDetallesVenta(id) {
        setVentasAbiertas(prev => ({ ...prev, [id]: !prev[id] }))
    }

    function toggleDetallesCompra(id) {
        setComprasAbiertas(prev => ({ ...prev, [id]: !prev[id] }))
    }

    function parseItems(v) {
        if (Array.isArray(v.itemsJson)) return v.itemsJson
        try { return JSON.parse(v.itemsJson) } catch { return [] }
    }

    if (loading) return <p style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>Cargando...</p>

    return (
        <main className='sale-container'>

            <header>
                <Navbar />
            </header>

            {/* ===== VENTAS ===== */}
            <h1>Historial de ventas</h1>

            <section id="historial">
                {ventas.length === 0 ? (
                    <p>No hay ventas registradas</p>
                ) : (
                    ventas.map(v => {
                        const items = parseItems(v)
                        return (
                            <div key={v.id} className="venta">
                                <strong>Venta {v.id}</strong>
                                <p>{v.fecha}</p>
                                <p>Método: {v.metodoPago}</p>

                                <button onClick={() => toggleDetallesVenta(v.id)}>
                                    {ventasAbiertas[v.id] ? 'Ocultar detalles' : 'Mostrar detalles'}
                                </button>

                                {ventasAbiertas[v.id] && (
                                    <div className="item-detalles">
                                        {items.map((i, index) => (
                                            <p key={index}>{i.nombre} x{i.cantidad} — ${i.precio}</p>
                                        ))}
                                    </div>
                                )}

                                <p>Total: ${v.total}</p>
                            </div>
                        )
                    })
                )}
            </section>

            {/* ===== COMPRAS ===== */}
            <h1 style={{ marginTop: '40px' }}>Historial de compras</h1>

            <section id="historial">
                {compras.length === 0 ? (
                    <p>No hay compras registradas</p>
                ) : (
                    compras.map(c => (
                        <div key={c.id} className="venta">
                            <strong>Compra {c.id}</strong>
                            <p>{c.fecha}</p>
                            <p>Producto: {c.producto}</p>
                            <p>Cantidad: {c.cantidad}</p>
                            <p>Costo unitario: ${c.costo}</p>

                            <button onClick={() => toggleDetallesCompra(c.id)}>
                                {comprasAbiertas[c.id] ? 'Ocultar detalles' : 'Mostrar detalles'}
                            </button>

                            {comprasAbiertas[c.id] && (
                                <div className="item-detalles">
                                    <p>Total compra: ${c.total}</p>
                                </div>
                            )}

                            <p>Total: ${c.total}</p>
                        </div>
                    ))
                )}
            </section>

        </main>
    )
}

export default SaleHistory