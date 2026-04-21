import { Link, useNavigate, useParams } from "react-router-dom"
import CategoryList from "../components/APIComponents"
import '../styles/newProduct.css'
import { fetchResource, updateResource, postResource } from "../services/api"
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import { useEffect, useState } from "react"

function normalize(str) {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
}

export default function EditProduct() {

    const { id } = useParams()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [producto, setProducto] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState("")
    const [customCategory, setCustomCategory] = useState("")

    useEffect(() => {
        async function cargar() {
            const productos = await fetchResource(1)
            const prod = productos.find(p => p.id == id)
            setProducto(prod)
            setSelectedCategory(prod?.categoria ?? "")
        }
        cargar()
    }, [id])

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.target)

        try {
            const rawCategory = customCategory.trim() !== ""
                ? customCategory.trim()
                : selectedCategory.trim()

            if (!rawCategory) {
                Toastify({
                    text: `Debes seleccionar o ingresar una categoría`,
                    duration: 3000,
                    close: true,
                    gravity: 'top',
                    position: 'center',
                    stopOnFocus: true,
                    style: { background: 'linear-gradient(to right, #ca222a, #dd50a2)' }
                }).showToast()
                setLoading(false)
                return
            }

            const categoriesData = await fetchResource(6)
            const matchingCategory = categoriesData.find(
                c => normalize(c.nombre) === normalize(rawCategory)
            )

            let finalCategory
            if (matchingCategory) {
                finalCategory = matchingCategory.nombre
            } else {
                const newCategory = {
                    id: crypto.randomUUID(),
                    nombre: rawCategory,
                    fecha_creacion: new Date().toLocaleString()
                }
                await postResource(6, newCategory)
                finalCategory = rawCategory
            }

            const updated = {
                ...producto,
                nombre: formData.get('nombre'),
                categoria: finalCategory,
                descripcion: formData.get('descripcion'),
                precio: formData.get('precio'),
                imagen: formData.get('imagen'),
                costo: formData.get('costo'),
                stock: formData.get('stock'),
                fecha_edicion: new Date().toLocaleString()
            }

            await updateResource(1, updated)

            Toastify({
                text: "Producto actualizado",
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'center',
                stopOnFocus: true,
                style: { background: 'linear-gradient(to right, #7c3aed, #a855f7)' }
            }).showToast()

            navigate('/catalogue')

        } catch (error) {
            Toastify({
                text: "Error al editar",
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'center',
                stopOnFocus: true,
                style: { background: 'linear-gradient(to right, #ca222a, #dd50a2)' }
            }).showToast()
        } finally {
            setLoading(false)
        }
    }

    if (!producto) return <p style={{ color: 'white', padding: '20px' }}>Cargando...</p>

    return (
        <section className="prod-container">
            <header>
                <section>
                    <Link to="/catalogue">
                        <i className="fa fa-arrow-left" aria-hidden="true"></i>
                        <h2>Volver</h2>
                    </Link>
                </section>
            </header>

            <main className="form-container">
                <form onSubmit={handleSubmit}>
                    <h3>Información de venta</h3>

                    <section className="form-group">
                        <label>Nombre del producto: </label>
                        <input name="nombre" defaultValue={producto.nombre} required />
                    </section>

                    <section className="form-group">
                        <label>Categoría: </label>
                        <CategoryList
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        />
                    </section>

                    <section className="form-group">
                        <label>O ingresa una nueva categoría: </label>
                        <input
                            placeholder="Nueva categoría..."
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                        />
                    </section>

                    <section className="form-group">
                        <label>Descripción: </label>
                        <input name="descripcion" defaultValue={producto.descripcion} />
                    </section>

                    <section className="form-group">
                        <label>Precio: </label>
                        <input name="precio" type="number" defaultValue={producto.precio} required />
                    </section>

                    <section className="form-group">
                        <label>Imagen (dejar en blanco si no tiene): </label>
                        <input name="imagen" defaultValue={producto.imagen} />
                    </section>

                    <h3>Información de compra</h3>

                    <section className="form-group">
                        <label>Costo: </label>
                        <input name="costo" type="number" defaultValue={producto.costo} required />
                    </section>

                    <section className="form-group">
                        <label>Stock: </label>
                        <input name="stock" type="number" defaultValue={producto.stock} required />
                    </section>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                </form>
            </main>
        </section>
    )
}