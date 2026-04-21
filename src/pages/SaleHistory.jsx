import { useState, useEffect } from 'react'
import { fetchResource, updateResource } from '../services/api'
import Navbar from '../components/Navbar'
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import '../styles/salehistory.css'

function SaleHistory() {

    const [ventas, setVentas] = useState([])
    const [compras, setCompras] = useState([])
    const [loading, setLoading] = useState(true)
    const [ventasAbiertas, setVentasAbiertas] = useState({})
    const [comprasAbiertas, setComprasAbiertas] = useState({})
    const [modalVenta, setModalVenta] = useState(null)
    const [metodoPago, setMetodoPago] = useState('')
    const [loadingPago, setLoadingPago] = useState(false)

    // 🔥 NUEVO
    const [filtroPago, setFiltroPago] = useState('Todos')

    useEffect(() => {
        cargarHistorial()
    }, [])

    async function cargarHistorial() {
        const [dataVentas, dataCompras] = await Promise.all([
            fetchResource(2),
            fetchResource(3)
        ])
        setVentas(dataVentas)
        setCompras(dataCompras)
        setLoading(false)
    }

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

    function abrirModal(venta) {
        setModalVenta(venta)
        setMetodoPago('')
    }

    function cerrarModal() {
        setModalVenta(null)
        setMetodoPago('')
    }

    async function confirmarPago() {
        if (!metodoPago) {
            Toastify({ text: 'Selecciona un método de pago', duration: 2000, style: { background: '#ca222a' } }).showToast()
            return
        }

        try {
            setLoadingPago(true)
            await updateResource(2, {
                ...modalVenta,
                metodoPago
            })
            await cargarHistorial()
            cerrarModal()
            Toastify({
                text: 'Pago registrado ✔',
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'center',
                style: { background: 'linear-gradient(to right, #7c3aed, #a855f7)' }
            }).showToast()
        } catch {
            Toastify({ text: 'Error al registrar el pago', duration: 2000, style: { background: '#ca222a' } }).showToast()
        } finally {
            setLoadingPago(false)
        }
    }
    const ventasFiltradas = ventas.filter(v => {
        if (filtroPago === 'Todos') return true
        return v.metodoPago === filtroPago
    })

    if (loading) return <p style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>Cargando...</p>

    return (
        <main className='sale-container'>

            <header>
                <Navbar />
            </header>

            {/* ===== MODAL ===== */}
            {modalVenta && (
                <div className="modal-overlay" onClick={cerrarModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>Registrar pago</h2>

                        <div className="modal-items">
                            {parseItems(modalVenta).map((i, index) => (
                                <div key={index}>
                                    {i.nombre} x{i.cantidad}
                                </div>
                            ))}
                        </div>

                        <p>Total: ${Number(modalVenta.total).toLocaleString()}</p>

                        <div className="modal-metodos">
                            {['Efectivo', 'Nequi'].map(m => (
                                <button
                                    key={m}
                                    className={metodoPago === m ? 'metodo-activo' : ''}
                                    onClick={() => setMetodoPago(m)}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>

                        <button onClick={confirmarPago}>
                            {loadingPago ? 'Procesando...' : 'Confirmar pago'}
                        </button>
                        <button onClick={cerrarModal}>Cancelar</button>
                    </div>
                </div>
            )}

            {/* ===== VENTAS ===== */}
            <h1>Historial de ventas</h1>

            {/* == FILTROS UI == */} 
            <div className="filtros">
                {['Todos', 'Efectivo', 'Nequi', 'Debe'].map(f => (
                    <button
                        key={f}
                        className={filtroPago === f ? 'activo' : ''}
                        onClick={() => setFiltroPago(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <section id="historial">
                {ventasFiltradas.length === 0 ? (
                    <p>No hay ventas</p>
                ) : (
                    ventasFiltradas.map(v => {
                        const items = parseItems(v)
                        const isDebe = v.metodoPago === 'Debe'

                        return (
                            <div key={v.id} className="venta">

                                <p>{v.fecha}</p>
                                <p>{v.metodoPago}</p>

                                <button onClick={() => toggleDetallesVenta(v.id)}>
                                    {ventasAbiertas[v.id] ? 'Ocultar' : 'Ver'}
                                </button>

                                {ventasAbiertas[v.id] && (
                                    <div>
                                        {items.map((i, index) => (
                                            <p key={index}>{i.nombre} x{i.cantidad}</p>
                                        ))}
                                    </div>
                                )}

                                <p>Total: ${v.total}</p>

                                {isDebe && (
                                    <button onClick={() => abrirModal(v)}>
                                        Pagar
                                    </button>
                                )}
                            </div>
                        )
                    })
                )}
            </section>

            {/* ===== COMPRAS ===== */}
            <h1 style={{ marginTop: '40px' }}>Historial de compras</h1>

            <section id="historial">
                {compras.map(c => {
                    const items = parseItems(c)
                    return (
                        <div key={c.id} className="venta">
                            <p>{c.fecha}</p>

                            <button onClick={() => toggleDetallesCompra(c.id)}>
                                {comprasAbiertas[c.id] ? 'Ocultar' : 'Ver'}
                            </button>

                            {comprasAbiertas[c.id] && (
                                <div>
                                    {items.map((i, index) => (
                                        <p key={index}>{i.nombre} x{i.cantidad}</p>
                                    ))}
                                </div>
                            )}

                            <p>Total: ${c.total}</p>
                        </div>
                    )
                })}
            </section>

        </main>
    )
}

export default SaleHistory