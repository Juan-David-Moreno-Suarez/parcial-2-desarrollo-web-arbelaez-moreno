import { useEffect, useState } from "react"
import { fetchResource, postResource, updateResource, deleteResource } from "../services/api"
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

export default function Providers() {

    const [providers, setProviders] = useState([])
    const [search, setSearch] = useState('')
    const [editing, setEditing] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadProviders()
    }, [])

    async function loadProviders() {
        setLoading(true)
        const data = await fetchResource(5)
        setProviders(data)
        setLoading(false)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const form = new FormData(e.target)

        const data = {
            id: editing ? editing.id : crypto.randomUUID(),
            nombre: form.get('nombre'),
            telefono: form.get('telefono')
        }

        try {
            if (editing) {
                await updateResource(5, editing.id, data)
                loadProviders()
                Toastify({ text: "Proveedor editado", duration: 2000 }).showToast()
            } else {
                await postResource(5, data)
                loadProviders()
                Toastify({ text: "Proveedor creado", duration: 2000 }).showToast()
            }
            setEditing(null)
            e.target.reset()


        } catch {
            Toastify({ text: "Error", duration: 2000 }).showToast()
        }
    }

    async function eliminar(id) {
        await deleteResource(5, id)
        loadProviders()
    }

    const filtrados = providers.filter(p =>
        p.nombre.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <main>

            <h1>Proveedores</h1>

            <input
                placeholder="Buscar..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            <form onSubmit={handleSubmit}>
                <input name="nombre" placeholder="Nombre" required />
                <input name="telefono" placeholder="Teléfono" />
                <button>{editing ? "Editar" : "Crear"}</button>
            </form>

            {loading ? "Cargando..." :
                filtrados.map(p => (
                    <div key={p.id}>
                        <p>{p.nombre}</p>
                        <button onClick={() => setEditing(p)}>Editar</button>
                        <button onClick={() => eliminar(p.id)}>Eliminar</button>
                    </div>
                ))}

        </main>
    )
}