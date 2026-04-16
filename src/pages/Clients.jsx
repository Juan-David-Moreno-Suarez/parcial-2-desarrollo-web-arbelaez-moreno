import { useEffect, useState } from "react"
import { fetchResource, postResource, updateResource, deleteResource } from "../services/api"
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import Navbar from '../components/Navbar'
export default function Clients() {

    const [clients, setClients] = useState([])
    const [search, setSearch] = useState('')
    const [editing, setEditing] = useState(null)

    useEffect(() => {
        loadClients()
    }, [])

    async function loadClients() {
        const data = await fetchResource(4)
        setClients(data)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const form = new FormData(e.target)

    const data = {
        id: editing ? editing.id : crypto.randomUUID(),
        nombre: form.get('nombre'),
        email: form.get('email') || '',
        telefono: form.get('telefono') || ''
    }

        try {
            if (editing) {
                await updateResource(4, editing.id, data)
                Toastify({ text: "Cliente editado", duration: 2000 }).showToast()
            } else {
                await postResource(4, data)
                Toastify({ text: "Cliente creado", duration: 2000 }).showToast()
            }

            setEditing(null)
            e.target.reset()
            loadClients()

        } catch {
            Toastify({ text: "Error", duration: 2000 }).showToast()
        }
    }

    async function eliminar(id) {
        await deleteResource(4, id)
        loadClients()
    }

    const filtrados = clients.filter(c =>
        c.nombre.toLowerCase().includes(search.toLowerCase())
    )

    return (
    <main className="clients-container">

        <header>
            <Navbar />
        </header>

        <section className="clients-content">

            <h1>Clientes</h1>

            <input
                placeholder="Buscar cliente..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            <form onSubmit={handleSubmit}>
                <input name="nombre" placeholder="Nombre" required />

                <input
                    name="email"
                    placeholder="Email"
                    defaultValue={editing?.email || ''}
                />

                <input
                    name="telefono"
                    placeholder="Teléfono"
                    defaultValue={editing?.telefono || ''}
                />

                <button>
                    {editing ? "Guardar cambios" : "Crear cliente"}
                </button>
            </form>

            {filtrados.map(c => (
                <div key={c.id} className="client-card">

                    <p>{c.nombre}</p>
                    <p>{c.email}</p>
                    <p>{c.telefono}</p>

                    <button onClick={() => setEditing(c)}>
                        Editar
                    </button>

                    <button onClick={() => eliminar(c.id)}>
                        Eliminar
                    </button>

                </div>
            ))}

        </section>

    </main>
    )
}