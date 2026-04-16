import { useState } from 'react'
import { safeArray } from '../hooks/useLocalStorage'
import Navbar from '../components/Navbar'
import '../styles/salehistory.css'

function SaleHistory() {

    const [ventas] = useState(safeArray('ventas'))
    const [compras] = useState(safeArray('compras')) // 🔥 NUEVO

    const [ventasAbiertas, setVentasAbiertas] = useState({})
    const [comprasAbiertas, setComprasAbiertas] = useState({})

    function toggleDetallesVenta(id) {
        setVentasAbiertas(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    function toggleDetallesCompra(id) {
        setComprasAbiertas(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

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
                    ventas.map(v => (
                        <div key={v.id} className="venta">

                            <strong>Venta {v.id}</strong>
                            <p>{v.fecha}</p>
                            <p>Método: {v.metodoPago}</p>

                            <p>Items:</p>
                            {v.items.map((i, index) => (
                                <img key={index} src={i.imagen} width="100" alt={i.nombre} />
                            ))}

                            <button onClick={() => toggleDetallesVenta(v.id)}>
                                {ventasAbiertas[v.id] ? 'Ocultar detalles' : 'Mostrar detalles'}
                            </button>

                            {ventasAbiertas[v.id] && (
                                <div className="item-detalles">
                                    {v.items.map((i, index) => (
                                        <p key={index}>{i.nombre} x{i.cantidad}</p>
                                    ))}
                                </div>
                            )}
                            <p>Total: ${v.total}</p>
                        </div>
                    ))
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