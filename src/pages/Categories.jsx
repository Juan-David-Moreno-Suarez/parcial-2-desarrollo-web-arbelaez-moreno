import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { fetchResource, postResource, updateResource, deleteResource } from "../services/api"
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import '../styles/categories.css'

export default function Categories() {

    const [categories, setCategories] = useState([])
    const [search, setSearch] = useState('')
    const [editing, setEditing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadingSave, setLoadingSave] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [confirmandoId, setConfirmandoId] = useState(null)
    const [formData, setFormData] = useState({ nombre: '' })

    useEffect(() => {
        loadCategories()
    }, [])

    async function loadCategories() {
        setLoading(true)
        const data = await fetchResource(6)
        setCategories(data)
        setLoading(false)
    }

    function handleEditar(c) {
        setEditing(c)
        setFormData({ nombre: c.nombre })
    }

    function handleCancelar() {
        setEditing(null)
        setFormData({ nombre: '' })
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const data = {
            id: editing ? editing.id : crypto.randomUUID(),
            nombre: formData.nombre
        }

        if (!editing) {
            const existe = categories.some(
                c => c.nombre.trim().toLowerCase() === data.nombre.trim().toLowerCase()
            )
            if (existe) {
                Toastify({ text: "Esta categoría ya existe", duration: 3000, style: { background: "#c0392b" } }).showToast()
                return
            }
        }

        try {
            setLoadingSave(true)
            if (editing) {
                await updateResource(6, data)
                Toastify({ text: "Categoría editada", duration: 2000 }).showToast()
            } else {
                await postResource(6, data)
                Toastify({ text: "Categoría creada", duration: 2000 }).showToast()
            }
            setEditing(null)
            setFormData({ nombre: '' })
            loadCategories()
        } catch {
            Toastify({ text: "Error", duration: 2000 }).showToast()
        } finally {
            setLoadingSave(false)
        }
    }

    async function eliminar(id, nombre) {
        setLoadingDelete(true)
        await deleteResource(6, id)
        await loadCategories()
        setConfirmandoId(null)
        setLoadingDelete(false)
        Toastify({ text: `Se ha eliminado la categoría ${nombre}`, duration: 2000 }).showToast()
    }

    const filtrados = categories.filter(c =>
        (c.nombre || '').toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="categories-container">
            <header>
                <Link to="/">
                    <i className="fa fa-arrow-left" aria-hidden="true"></i>
                    <h2>Volver</h2>
                </Link>
            </header>

            <div className="categories-content">
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
                        value={formData.nombre}
                        onChange={e => setFormData({ nombre: e.target.value })}
                        required
                    />
                    <button type="submit" disabled={loadingSave}>
                        {loadingSave ? "Guardando..." : editing ? "Guardar" : "Crear"}
                    </button>
                    {editing && (
                        <button type="button" onClick={handleCancelar} disabled={loadingSave}>
                            Cancelar
                        </button>
                    )}
                </form>

                {loading ? (
                    <p style={{ color: '#888', textAlign: 'center' }}>Cargando...</p>
                ) : filtrados.length === 0 ? (
                    <p style={{ color: '#888', textAlign: 'center' }}>Sin resultados</p>
                ) : (
                    filtrados.map(c => (
                        <div className="category-card" key={c.id}>
                            <p>{c.nombre}</p>
                            <div className="category-actions">
                                <button onClick={() => handleEditar(c)}>Editar</button>
                                {confirmandoId === c.id ? (
                                    <section className="confirmar-eliminar">
                                        <span>¿Eliminar?</span>
                                        <button disabled={loadingDelete} onClick={() => eliminar(c.id, c.nombre)}>
                                            {loadingDelete ? "Eliminando..." : "Sí"}
                                        </button>
                                        <button disabled={loadingDelete} onClick={() => setConfirmandoId(null)}>
                                            No
                                        </button>
                                    </section>
                                ) : (
                                    <button onClick={() => setConfirmandoId(c.id)}>Eliminar</button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}