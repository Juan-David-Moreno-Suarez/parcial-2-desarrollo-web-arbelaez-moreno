import { Link } from "react-router-dom"
import { fetchResource, postResource, updateResource } from "../services/api"
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import { useState } from "react"

export default function Purchase() {

    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.target)
        const nombre = formData.get('nombre')
        const cantidad = Number(formData.get('cantidad'))
        const costo = Number(formData.get('costo'))

        try {
            const productos = await fetchResource(1)
            const producto = productos.find(p => p.nombre === nombre)

            if (!producto) {
                Toastify({
                    text: "Producto no encontrado",
                    duration: 3000,
                    style: { background: "#ca222a" }
                }).showToast()
                return
            }

            // actualizar stock
            const updated = {
                ...producto,
                stock: Number(producto.stock) + cantidad
            }

            await updateResource(1, producto.id, updated)

            //guardar historial de compra
            const compra = {
                id: crypto.randomUUID(),
                producto: nombre,
                cantidad,
                costo,
                total: cantidad * costo,
                fecha: new Date().toLocaleString()
            }

            await postResource(3, compra) // recurso 3 = compras

            Toastify({
                text: "Compra registrada",
                duration: 3000,
                style: { background: "#7c3aed" }
            }).showToast()

        } catch (err) {
            Toastify({
                text: "Error en compra",
                duration: 3000,
                style: { background: "#ca222a" }
            }).showToast()
        }

        setLoading(false)
    }

    return (
        <section className="prod-container">
            <header>
                <Link to="/catalogue">← Volver</Link>
            </header>

            <main className="form-container">
                <form onSubmit={handleSubmit}>

                    <h3>Registrar compra</h3>

                    <input name="nombre" placeholder="Producto" required />
                    <input name="cantidad" type="number" placeholder="Cantidad" required />
                    <input name="costo" type="number" placeholder="Costo unitario" required />

                    <button disabled={loading}>
                        {loading ? "Guardando..." : "Registrar compra"}
                    </button>

                </form>
            </main>
        </section>
    )
}