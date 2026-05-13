import { useNavigate } from "react-router-dom"
import { fetchResource, postResource, updateResource } from "../services/api"
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import { useState, useEffect } from "react"
import '../styles/newProduct.css'

const STORAGE_KEY = 'purchaseItems'

function guardarItems(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

function obtenerItems() {
    try {
        const data = localStorage.getItem(STORAGE_KEY)
        return data ? JSON.parse(data) : []
    } catch {
        return []
    }
}

export default function Purchase() {

    const [loading, setLoading] = useState(false)
    const [loadingProductos, setLoadingProductos] = useState(true)
    const [loadingProveedores, setLoadingProveedores] = useState(true)

    const [productos, setProductos] = useState([])
    const [proveedores, setProveedores] = useState([])

    const [selectedProducto, setSelectedProducto] = useState('')
    const [selectedProveedor, setSelectedProveedor] = useState('')
    const [cantidad, setCantidad] = useState('')
    const [costoUnitario, setCostoUnitario] = useState('')

    const [items, setItems] = useState(obtenerItems())

    const navigate = useNavigate()

    useEffect(() => {
        guardarItems(items)
    }, [items])

    useEffect(() => {
        async function cargarDatos() {
            try {
                setLoadingProductos(true)
                const data = await fetchResource(1)
                setProductos(data)
            } catch {
                setProductos([])
            } finally {
                setLoadingProductos(false)
            }
        }

        cargarDatos()
    }, [])

    useEffect(() => {
        async function cargarProveedores() {
            try {
                setLoadingProveedores(true)
                const data = await fetchResource(5)
                setProveedores(data)
            } catch {
                setProveedores([])
            } finally {
                setLoadingProveedores(false)
            }
        }

        cargarProveedores()
    }, [])

    const productoSeleccionado = productos.find(
        p => p.id === selectedProducto
    )

    const cantidadValida =
        Number(cantidad) > 0 &&
        !isNaN(Number(cantidad))

    const costoValido =
        Number(costoUnitario) > 0 &&
        !isNaN(Number(costoUnitario))

    const itemSubtotal =
        cantidadValida && costoValido
            ? Number(cantidad) * Number(costoUnitario)
            : 0

    const totalCompra = items.reduce(
        (sum, item) => sum + item.subtotal,
        0
    )

    function showToast(text) {
        Toastify({
            text,
            duration: 3000,
            style: { background: '#ca222a' }
        }).showToast()
    }

    function handleProductoChange(e) {
        const id = e.target.value

        setSelectedProducto(id)

        const prod = productos.find(p => p.id === id)

        if (prod) {
            setCostoUnitario(prod.costo ?? '')
        }
    }

    function handleAgregarItem() {

        if (!selectedProducto) {
            showToast('Selecciona un producto para agregar')
            return
        }

        if (!cantidadValida) {
            showToast('Ingresa una cantidad válida')
            return
        }

        if (!costoValido) {
            showToast('Ingresa un costo unitario válido')
            return
        }

        const producto = productos.find(
            p => p.id === selectedProducto
        )

        if (!producto) {
            showToast('Producto no válido')
            return
        }

        const nuevoItem = {
            productoId: selectedProducto,
            nombre: producto.nombre,
            cantidad: Number(cantidad),
            costo: Number(costoUnitario),
            subtotal: Number(cantidad) * Number(costoUnitario)
        }

        setItems(prev => {

            const index = prev.findIndex(
                item => item.productoId === selectedProducto
            )

            if (index >= 0) {

                const actualizado = [...prev]

                const existente = actualizado[index]

                const cantidadTotal =
                    existente.cantidad + nuevoItem.cantidad

                actualizado[index] = {
                    ...existente,
                    cantidad: cantidadTotal,
                    costo: nuevoItem.costo,
                    subtotal: cantidadTotal * nuevoItem.costo
                }

                return actualizado
            }

            return [...prev, nuevoItem]
        })

        setSelectedProducto('')
        setCantidad('')
        setCostoUnitario('')
    }

    function handleEliminarItem(productoId) {

        const nuevosItems = items.filter(
            item => item.productoId !== productoId
        )

        setItems(nuevosItems)
    }

    async function handleSubmit(e) {

        e.preventDefault()

        if (items.length === 0) {
            showToast('Agrega al menos un producto a la compra')
            return
        }

        if (!selectedProveedor) {
            showToast('Selecciona un proveedor para esta compra')
            return
        }

        setLoading(true)

        try {

            const actualizaciones = items.map(item => {

                const producto = productos.find(
                    p => p.id === item.productoId
                )

                if (!producto) {
                    throw new Error(
                        `No se encontró el producto ${item.nombre}`
                    )
                }

                return updateResource(1, {
                    ...producto,
                    stock: Number(producto.stock) + item.cantidad,
                    costo: item.costo
                })
            })

            await Promise.all(actualizaciones)

            const compra = {
                id: crypto.randomUUID(),
                fecha: new Date().toLocaleString(),
                proveedorId: selectedProveedor,
                total: totalCompra,
                itemsJson: JSON.stringify(
                    items.map(
                        ({
                            productoId,
                            nombre,
                            cantidad,
                            costo
                        }) => ({
                            productoId,
                            nombre,
                            cantidad,
                            costo
                        })
                    )
                )
            }

            await postResource(3, compra)

            localStorage.removeItem(STORAGE_KEY)

            Toastify({
                text: 'Compra registrada ✔',
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'center',
                style: {
                    background:
                        'linear-gradient(to right, #7c3aed, #a855f7)'
                }
            }).showToast()

            navigate('/')

        } catch (error) {

            console.error(error)

            showToast('Error al registrar la compra')

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
                        onClick={() => navigate('/')}
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
                        <i className="fa fa-arrow-left"></i>
                        <h2>Volver</h2>
                    </button>
                </section>
            </header>

            <main className="form-container">

                <form onSubmit={handleSubmit}>

                    <h3>Registrar compra</h3>

                    <section className="form-group">

                        <label>Proveedor:</label>

                        <div
                            style={{
                                display: 'flex',
                                gap: '10px',
                                flexWrap: 'wrap',
                                alignItems: 'center'
                            }}
                        >

                            {loadingProveedores ? (

                                <p
                                    style={{
                                        color: '#888',
                                        fontSize: '0.9rem',
                                        margin: 0
                                    }}
                                >
                                    Cargando proveedores...
                                </p>

                            ) : proveedores.length === 0 ? (

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '8px'
                                    }}
                                >
                                    <p
                                        style={{
                                            color: '#888',
                                            fontSize: '0.9rem',
                                            margin: 0
                                        }}
                                    >
                                        No hay proveedores registrados
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => navigate('/providers')}
                                    >
                                        + Agregar proveedor
                                    </button>
                                </div>

                            ) : (

                                <>
                                    <select
                                        value={selectedProveedor}
                                        onChange={e =>
                                            setSelectedProveedor(
                                                e.target.value
                                            )
                                        }
                                        required
                                    >
                                        <option value="">
                                            -- Selecciona un proveedor --
                                        </option>

                                        {proveedores.map(p => (
                                            <option
                                                key={p.id}
                                                value={p.id}
                                            >
                                                {p.nombre}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate('/providers')
                                        }
                                    >
                                        + Nuevo proveedor
                                    </button>
                                </>
                            )}
                        </div>
                    </section>

                    <section className="form-group">

                        <label>
                            Agregar producto al abastecimiento:
                        </label>

                        <div
                            style={{
                                display: 'flex',
                                gap: '10px',
                                flexWrap: 'wrap',
                                alignItems: 'center'
                            }}
                        >

                            <select
                                value={selectedProducto}
                                onChange={handleProductoChange}
                            >
                                <option value="">
                                    -- Selecciona un producto --
                                </option>

                                {productos.map(p => (
                                    <option
                                        key={p.id}
                                        value={p.id}
                                    >
                                        {p.nombre}
                                    </option>
                                ))}
                            </select>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate('/newProduct?from=purchase')
                                }
                            >
                                + Nuevo producto
                            </button>
                        </div>

                        {productoSeleccionado && (
                            <p
                                style={{
                                    color: '#666',
                                    fontSize: '0.9rem',
                                    marginTop: '8px'
                                }}
                            >
                                Stock actual:
                                {' '}
                                {productoSeleccionado.stock}
                                {' '}
                                unidades
                            </p>
                        )}
                    </section>

                    <section
                        className="form-group"
                        style={{
                            display: 'grid',
                            gap: '10px',
                            gridTemplateColumns: '1fr 1fr'
                        }}
                    >

                        <div>
                            <label>Cantidad:</label>

                            <input
                                type="number"
                                min="1"
                                value={cantidad}
                                onChange={e =>
                                    setCantidad(e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label>Costo unitario:</label>

                            <input
                                type="number"
                                min="0"
                                value={costoUnitario}
                                onChange={e =>
                                    setCostoUnitario(e.target.value)
                                }
                            />
                        </div>
                    </section>

                    {itemSubtotal > 0 && (
                        <section className="form-group">

                            <label>Subtotal:</label>

                            <p
                                style={{
                                    color: 'rgb(122, 105, 231)',
                                    fontWeight: 'bold'
                                }}
                            >
                                ${itemSubtotal.toLocaleString()}
                            </p>
                        </section>
                    )}

                    <button
                        type="button"
                        onClick={handleAgregarItem}
                    >
                        Agregar producto al abastecimiento
                    </button>

                    {items.length > 0 && (

                        <section
                            className="form-group"
                            style={{ marginBottom: '20px' }}
                        >

                            <label>
                                Productos en la compra:
                            </label>

                            <div
                                className="items-table"
                                style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    overflow: 'hidden'
                                }}
                            >

                                {items.map(item => (

                                    <div
                                        key={item.productoId}
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns:
                                                '3fr 1fr 1fr 1fr 0.8fr',
                                            gap: '10px',
                                            padding: '10px',
                                            alignItems: 'center',
                                            borderTop: '1px solid #eee'
                                        }}
                                    >

                                        <span>{item.nombre}</span>

                                        <span>{item.cantidad}</span>

                                        <span>
                                            $
                                            {item.costo.toLocaleString()}
                                        </span>

                                        <span>
                                            $
                                            {item.subtotal.toLocaleString()}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEliminarItem(
                                                    item.productoId
                                                )
                                            }
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <section className="form-group">

                        <label>Total de la compra:</label>

                        <p
                            style={{
                                color: 'rgb(122, 105, 231)',
                                fontWeight: 'bold',
                                fontSize: '1.3rem',
                                padding: '10px 0'
                            }}
                        >
                            ${totalCompra.toLocaleString()}
                        </p>
                    </section>

                    <button
                        type="submit"
                        disabled={
                            loading ||
                            items.length === 0 ||
                            !selectedProveedor
                        }
                    >
                        {loading
                            ? 'Guardando...'
                            : 'Registrar compra'}
                    </button>
                </form>
            </main>
        </section>
    )
}