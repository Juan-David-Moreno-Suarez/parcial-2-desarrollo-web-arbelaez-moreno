import { Link, useNavigate } from "react-router-dom"
import CategoryList from "../components/APIComponents"
import '../styles/newProduct.css'
import { fetchResource, postResource } from "../services/api"
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import { useState } from "react"

export default function NewProduct() {

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(data) {
        data.preventDefault()
        setLoading(true)
        const formData = new FormData(data.target)
        const name = formData.get('nombre')

        const productsData = await fetchResource(1)
        const exists = productsData.find(p => p.nombre.toLowerCase() === name.toLowerCase())

        if (exists) {
            Toastify({
                text: `El producto ${name} ya está registrado`,
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'center',
                stopOnFocus: true,
                style: {
                    background: 'linear-gradient(to right, #ca222a, #dd50a2)',
                }
            }).showToast()
            setLoading(false)
            return
        }
        try {
            const inputData = {
                id: crypto.randomUUID(),
                nombre: formData.get('nombre'),
                categoria: formData.get('categoria'),
                descripcion: formData.get('descripcion'),
                precio: formData.get('precio'),
                imagen: formData.get('imagen'),
                costo: formData.get('costo'),
                stock: formData.get('stock'),
                fecha_creacion: new Date().toLocaleString()
            }

            await postResource(1, inputData);
            navigate('/catalogue')
        } catch (error) {
            Toastify({
                text: `Error al crear el producto`,
                duration: 3000,
                close: true,
                gravity: 'top',
                position: 'center',
                stopOnFocus: true,
                style: {
                    background: 'linear-gradient(to right, #ca222a, #dd50a2)',
                }
            }).showToast()
        } finally {
            setLoading(false)
        }

    }

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
                        <input name="nombre" required />
                    </section>

                    <section className="form-group">
                        <label>Categoría: </label>
                        <CategoryList />
                    </section>

                    <section className="form-group">
                        <label>Descripción: </label>
                        <input name="descripcion" />
                    </section>

                    <section className="form-group">
                        <label>Precio: </label>
                        <input name="precio" type='number' required />
                    </section>

                    <section className="form-group">
                        <label>Imagen (dejar en blanco si no tiene): </label>
                        <input name="imagen" />
                    </section>

                    <h3>Información de compra</h3>

                    <section className="form-group">
                        <label>Costo: </label>
                        <input name="costo" type="number" required />
                    </section>

                    <section className="form-group">
                        <label>Stock: </label>
                        <input name="stock" type="number" required />
                    </section>

                    <button type="submit" disabled={loading} >{loading ? 'Guardando...' : 'Crear producto'}</button>
                </form>
            </main>
        </section>
    )
}