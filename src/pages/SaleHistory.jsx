import { useState } from 'react'
import { safeArray } from '../hooks/useLocalStorage'
import Navbar from '../components/Navbar'
import '../styles/salehistory.css'

function SaleHistory() {
    const [ventas] = useState(safeArray('ventas'))
    const [ventasAbiertas, setVentasAbiertas] = useState({})

    function toggleDetalles(id) {
        setVentasAbiertas(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    return (
        <main className='sale-container'>
            <header>
                <Navbar />
            </header>
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
                            <button onClick={() => toggleDetalles(v.id)}>
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
        </main>
    )
}

export default SaleHistory