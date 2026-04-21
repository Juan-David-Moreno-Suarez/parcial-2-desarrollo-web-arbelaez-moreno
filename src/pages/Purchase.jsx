import { useNavigate } from "react-router-dom"
import { fetchResource, postResource, updateResource } from "../services/api"
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import { useState, useEffect } from "react"
import '../styles/newProduct.css'

export default function Purchase() {

    const [loading, setLoading] = useState(false)
    const [loadingProductos, setLoadingProductos] = useState(true)
    const [productos, setProductos] = useState([])
    const [proveedores, setProveedores] = useState([])
    const [selectedProducto, setSelectedProducto] = useState('')
    const [selectedProveedor, setSelectedProveedor] = useState('')
    const [cantidad, setCantidad] = useState('')
    const [costoUnitario, setCostoUnitario] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        fetchResource(1)
            .then(setProductos)
            .catch(() => setProductos([]))
            .finally(() => setLoadingProductos(false))
    }, [])

    useEffect(() => {
        function cargarProveedores() {
            fetchResource(5).then(setProveedores).catch(() => setProveedores([]))
        }
        cargarProveedores()
        window.addEventListener('focus', cargarProveedores)
        return () => window.removeEventListener('focus', cargarProveedores)
    }, [])

    const productoSeleccionado = productos.find(p => p.id === selectedProducto)
    const cantidadValida = Number(cantidad) > 0 && !isNaN(Number(cantidad))
    const total = cantidadValida && costoUnitario ? Number(cantidad) * Number(costoUnitario) : null

    function handleProductoChange(e) {
        const id = e.target.value
        setSelectedProducto(id)
        const prod = productos.find(p => p.id === id)
        if (prod) setCostoUnitario(prod.costo ?? '')
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)

        if (!selectedProducto) {
            Toastify({ text: "Selecciona un producto", duration: 3000, style: { background: "#ca222a" } }).showToast()
            setLoading(false)
            return
        }

        if (!cantidadValida) {
            Toastify({ text: "Ingresa una cantidad válida", duration: 3000, style: { background: "#ca222a" } }).showToast()
            setLoading(false)
            return
        }

        if (!costoUnitario || Number(costoUnitario) <= 0) {
            Toastify({ text: "Ingresa un costo unitario válido", duration: 3000, style: { background: "#ca222a" } }).showToast()
            setLoading(false)
            return
        }

        try {
            const producto = productos.find(p => p.id === selectedProducto)

            // Actualizar stock y costo del producto
            await updateResource(1, {
                ...producto,
                stock: Number(producto.stock) + Number(cantidad),
                costo: Number(costoUnitario)
            })

            // Registrar compra con el mismo formato que ventas
            const compra = {
                id: crypto.randomUUID(),
                fecha: new Date().toLocaleString(),
                proveedorId: selectedProveedor || 'Sin proveedor',
                total: Number(cantidad) * Number(costoUnitario),
                itemsJson: JSON.stringify([{
                    id: producto.id,
                    nombre: producto.nombre,
                    cantidad: Number(cantidad),
                    costo: Number(costoUnitario)
                }])
            }

            await postResource(3, compra)

            Toastify({
                text: "Compra registrada ✔",
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'center',
                style: { background: 'linear-gradient(to right, #7c3aed, #a855f7)' }
            }).showToast()

            navigate(-1)

        } catch (err) {
            Toastify({
                text: "Error al registrar la compra",
                duration: 3000,
                style: { background: "#ca222a" }
            }).showToast()
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="prod-container">
            <header>
                <section>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'none',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: 'rgb(122, 105, 231)',
                            fontWeight: 'bold',
                            padding: '0 20px',
                            height: '100%',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        <i className="fa fa-arrow-left" aria-hidden="true"></i>
                        <h2>Volver</h2>
                    </button>
                </section>
            </header>

            <main className="form-container">
                <form onSubmit={handleSubmit}>
                    <h3>Registrar compra</h3>

                    <section className="form-group">
                        <label>Producto:</label>
                        {loadingProductos ? (
                            <p style={{ color: '#888', fontSize: '0.9rem' }}>Cargando productos...</p>
                        ) : productos.length === 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <p style={{ color: '#888', fontSize: '0.9rem' }}>No hay productos registrados</p>
                                <button type="button" onClick={() => navigate('/newProduct')}
                                    style={{ background: 'none', border: '1px solid #555', color: '#aaa', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
                                    + Crear un producto primero
                                </button>
                            </div>
                        ) : (
                            <select value={selectedProducto} onChange={handleProductoChange}>
                                <option value="">-- Selecciona un producto --</option>
                                {productos.map(p => (
                                    <option key={p.id} value={p.id}>{p.nombre}</option>
                                ))}
                            </select>
                        )}
                    </section>

                    {productoSeleccionado && (
                        <section className="form-group">
                            <label style={{ color: '#666', fontSize: '0.8rem' }}>
                                Stock actual: {productoSeleccionado.stock} unidades
                            </label>
                        </section>
                    )}

                    <section className="form-group">
                        <label>Proveedor (opcional):</label>
                        <select
                            value={selectedProveedor}
                            onChange={e => setSelectedProveedor(e.target.value)}
                        >
                            <option value="">-- Selecciona un proveedor --</option>
                            {proveedores.map(p => (
                                <option key={p.id} value={p.nombre}>{p.nombre}</option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={() => navigate('/providers')}
                            style={{ background: 'none', border: '1px solid #555', color: '#aaa', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                            + Agregar nuevo proveedor
                        </button>
                    </section>

                    <section className="form-group">
                        <label>Cantidad:</label>
                        <input
                            type="number"
                            min="1"
                            value={cantidad}
                            onChange={e => setCantidad(e.target.value)}
                            placeholder="Ej: 10"
                        />
                    </section>

                    <section className="form-group">
                        <label>Costo unitario:</label>
                        <input
                            type="number"
                            min="0"
                            value={costoUnitario}
                            onChange={e => setCostoUnitario(e.target.value)}
                            placeholder="Se llena automáticamente"
                        />
                    </section>

                    {total !== null && (
                        <section className="form-group">
                            <label>Total de la compra:</label>
                            <p style={{ color: 'rgb(122, 105, 231)', fontWeight: 'bold', fontSize: '1.1rem', padding: '10px 0' }}>
                                ${total.toLocaleString()}
                            </p>
                        </section>
                    )}

                    <button type="submit" disabled={loading || loadingProductos || productos.length === 0}>
                        {loading ? "Guardando..." : "Registrar compra"}
                    </button>
                </form>
            </main>
        </section>
    )
}