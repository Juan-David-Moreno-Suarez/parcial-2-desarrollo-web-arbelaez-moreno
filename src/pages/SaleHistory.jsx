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

    if (loading) return <p style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>Cargando...</p>

    return (
        <main className='sale-container'>

            <header>
                <Navbar />
            </header>

            {/* ===== MODAL PAGO ===== */}
            {modalVenta && (
                <div className="modal-overlay" onClick={cerrarModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>Registrar pago</h2>
                        <p className="modal-cliente">Cliente: <strong>{modalVenta.clienteId || 'Sin cliente'}</strong></p>

                        <div className="modal-items">
                            {parseItems(modalVenta).map((i, index) => (
                                <div key={index} className="modal-item">
                                    <span>{i.nombre}</span>
                                    <span>x{i.cantidad}</span>
                                    <span>${Number(i.precio).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        <p className="modal-total">Total: <strong>${Number(modalVenta.total).toLocaleString()}</strong></p>

                        <div className="modal-metodos">
                            {['Efectivo', 'Nequi'].map(m => (
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

                        <div className="modal-acciones">
                            <button onClick={confirmarPago} disabled={loadingPago} className="btn-confirmar">
                                {loadingPago ? 'Procesando...' : 'Confirmar pago'}
                            </button>
                            <button onClick={cerrarModal} disabled={loadingPago} className="btn-cancelar">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== VENTAS ===== */}
            <h1>Historial de ventas</h1>

            <section id="historial">
                {ventas.length === 0 ? (
                    <p>No hay ventas registradas</p>
                ) : (
                    ventas.map(v => {
                        const items = parseItems(v)
                        const isDebe = v.metodoPago === 'Debe'
                        return (
                            <div key={v.id} className={`venta ${isDebe ? 'venta-debe' : ''}`}>
                                <div className="venta-header">
                                    <div className="venta-header-left">
                                        <span className="venta-fecha">{v.fecha}</span>
                                        <span className="venta-cliente">
                                            {v.clienteId && v.clienteId !== 'Sin cliente'
                                                ? `👤 ${v.clienteId}`
                                                : 'Sin cliente'}
                                        </span>
                                    </div>
                                    <span className={`badge ${isDebe ? 'badge-debe' : 'badge-pagado'}`}>
                                        {v.metodoPago}
                                    </span>
                                </div>

                                <div className="venta-body">
                                    <button className="btn-detalles" onClick={() => toggleDetallesVenta(v.id)}>
                                        {ventasAbiertas[v.id] ? 'Ocultar detalles' : 'Ver detalles'}
                                    </button>

                                    {ventasAbiertas[v.id] && (
                                        <div className="item-detalles">
                                            {items.map((i, index) => (
                                                <div key={index} className="detalle-row">
                                                    <span>{i.nombre}</span>
                                                    <span>x{i.cantidad}</span>
                                                    <span>${Number(i.precio).toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="venta-footer">
                                    <strong className="venta-total">Total: ${Number(v.total).toLocaleString()}</strong>
                                    {isDebe && (
                                        <button className="btn-pagar" onClick={() => abrirModal(v)}>
                                            💳 Pagar ahora
                                        </button>
                                    )}
                                </div>
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
                    compras.map(c => {
                        const items = parseItems(c)
                        return (
                            <div key={c.id} className="venta">
                                <div className="venta-header">
                                    <div className="venta-header-left">
                                        <span className="venta-fecha">{c.fecha}</span>
                                        <span className="venta-cliente">
                                            {c.proveedorId && c.proveedorId !== 'Sin proveedor'
                                                ? `🏭 ${c.proveedorId}`
                                                : 'Sin proveedor'}
                                        </span>
                                    </div>
                                </div>

                                <div className="venta-body">
                                    <button className="btn-detalles" onClick={() => toggleDetallesCompra(c.id)}>
                                        {comprasAbiertas[c.id] ? 'Ocultar detalles' : 'Ver detalles'}
                                    </button>

                                    {comprasAbiertas[c.id] && (
                                        <div className="item-detalles">
                                            {items.length === 0 ? (
                                                <p style={{ color: '#888', fontSize: '0.85rem' }}>Sin detalle de items</p>
                                            ) : (
                                                items.map((i, index) => (
                                                    <div key={index} className="detalle-row">
                                                        <span>{i.nombre}</span>
                                                        <span>x{i.cantidad}</span>
                                                        <span>${Number(i.costo).toLocaleString()} c/u</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="venta-footer">
                                    <strong className="venta-total">Total: ${Number(c.total || 0).toLocaleString()}</strong>
                                </div>
                            </div>
                        )
                    })
                )}
            </section>

        </main>
    )
}

export default SaleHistory