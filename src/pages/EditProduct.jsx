import { Link, useNavigate, useParams } from "react-router-dom"
import { fetchResource, putResource } from "../services/api"
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import { useEffect, useState } from "react"

export default function EditProduct() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [producto, setProducto] = useState(null)

    useEffect(() => {
        async function cargar() {
            const productos = await fetchResource(1)
            const prod = productos.find(p => p.id == id)
            setProducto(prod)
        }
        cargar()
    }, [id])

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.target)

        try {
            const updated = {
                ...producto,
                nombre: formData.get('nombre'),
                categoria: formData.get('categoria'),
                descripcion: formData.get('descripcion'),
                precio: formData.get('precio'),
                imagen: formData.get('imagen'),
                costo: formData.get('costo'),
                stock: formData.get('stock'),
            }

            await putResource(1, id, updated)

            Toastify({
                text: "Producto actualizado",
                duration: 3000,
                style: {
                    background: 'linear-gradient(to right, #7c3aed, #a855f7)',
                }
            }).showToast()

            navigate('/catalogue')

        } catch (error) {
            Toastify({
                text: "Error al editar",
                duration: 3000,
                style: { background: '#ca222a' }
            }).showToast()
        }

        setLoading(false)
    }

    if (!producto) return <p>Cargando...</p>

    return (
        <section className="prod-container">

            <header>
                <Link to="/catalogue">← Volver</Link>
            </header>

            <main className="form-container">
                <form onSubmit={handleSubmit}>

                    <h3>Editar producto</h3>

                    <input name="nombre" defaultValue={producto.nombre} required />
                    <input name="categoria" defaultValue={producto.categoria} />
                    <input name="descripcion" defaultValue={producto.descripcion} />
                    <input name="precio" type="number" defaultValue={producto.precio} />
                    <input name="imagen" defaultValue={producto.imagen} />
                    <input name="costo" type="number" defaultValue={producto.costo} />
                    <input name="stock" type="number" defaultValue={producto.stock} />

                    <button disabled={loading}>
                        {loading ? "Guardando..." : "Guardar cambios"}
                    </button>

                </form>
            </main>

        </section>
    )
}