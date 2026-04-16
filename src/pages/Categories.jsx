import { useEffect, useState } from "react"
import { fetchResource, postResource, updateResource, deleteResource } from "../services/api"
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import Navbar from '../components/Navbar'
export default function Categories() {
    const [categories, setCategories] = useState([])
    const [search, setSearch] = useState('')
    const [editing, setEditing] = useState(null)
    useEffect(() => {
        loadCategories()
    }, [])

    async function loadCategories() {
        const data = await fetchResource(6)
        setCategories(data)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const form = new FormData(e.target)

        const data = {
            id: editing ? editing.id : crypto.randomUUID(),
            nombre: form.get('nombre')
        }
        try {
            if (editing) {
                await updateResource(6, editing.id, data)
                Toastify({ text: "Categoría editada", duration: 2000 }).showToast()
            } else {
                await postResource(6, data)
                Toastify({ text: "Categoría creada", duration: 2000 }).showToast()
            }

            setEditing(null)
            e.target.reset()
            loadCategories()

        } catch {
            Toastify({ text: "Error", duration: 2000 }).showToast()
        }
    }

    async function eliminar(id) {
        await deleteResource(6, id)
        loadCategories()
    }
    const filtrados = (categories || []).filter(c =>
        (c.nombre || '').toLowerCase().includes(search.toLowerCase())
    )
    
    return (
        <main className="categories-container">
            <header>
                <Navbar />
            </header>

            <section className="categories-content">

                <h1>Categorías</h1>

                <input
                    placeholder="Buscar categoría..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                <form onSubmit={handleSubmit}>
                    <input
                        name="nombre"
                        placeholder="Nombre categoría"
                        defaultValue={editing?.nombre || ''}
                        required
                    />
                    <button>
                        {editing ? "Guardar cambios" : "Crear categoría"}
                    </button>
                </form>

                {filtrados.map(c => (
                    <div key={c.id} className="category-card">

                        <p>{c.nombre}</p>

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