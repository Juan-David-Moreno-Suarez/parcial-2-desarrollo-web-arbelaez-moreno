import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchResource, postResource, updateResource, deleteResource } from "../services/api"
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import '../styles/providers.css'

export default function Providers() {

    const [providers, setProviders] = useState([])
    const [search, setSearch] = useState('')
    const [editing, setEditing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadingSave, setLoadingSave] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [confirmandoId, setConfirmandoId] = useState(null)
    const [formData, setFormData] = useState({ nombre: '', telefono: '' })
    const navigate = useNavigate()

    useEffect(() => {
        loadProviders()
    }, [])

    async function loadProviders() {
        setLoading(true)
        const data = await fetchResource(5)
        setProviders(data)
        setLoading(false)
    }

    function handleEditar(p) {
        setEditing(p)
        setFormData({ nombre: p.nombre, telefono: p.telefono })
    }

    function handleCancelar() {
        setEditing(null)
        setFormData({ nombre: '', telefono: '' })
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const data = {
            id: editing ? editing.id : crypto.randomUUID(),
            nombre: formData.nombre,
            telefono: formData.telefono
        }

        if (!editing) {
            const existe = providers.some(
                p => p.nombre.trim().toLowerCase() === data.nombre.trim().toLowerCase()
            )
            if (existe) {
                Toastify({ text: "Este proveedor ya existe", duration: 3000, style: { background: "#c0392b" } }).showToast()
                return
            }
        }

        try {
            setLoadingSave(true)
            if (editing) {
                await updateResource(5, data)
                Toastify({ text: "Proveedor editado", duration: 2000 }).showToast()
            } else {
                await postResource(5, data)
                Toastify({ text: "Proveedor creado", duration: 2000 }).showToast()
            }
            setEditing(null)
            setFormData({ nombre: '', telefono: '' })
            loadProviders()
        } catch {
            Toastify({ text: "Error", duration: 2000 }).showToast()
        } finally {
            setLoadingSave(false)
        }
    }

    async function eliminar(id, nombre) {
        setLoadingDelete(true)
        await deleteResource(5, id)
        await loadProviders()
        setConfirmandoId(null)
        setLoadingDelete(false)
        Toastify({ text: `Se ha eliminado el proveedor ${nombre}`, duration: 2000 }).showToast()
    }

    const filtrados = providers.filter(p =>
        p.nombre.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <main className="providers-container">
            <header>
                <section>
                    <button type="button" onClick={() => navigate(-1)}>
                        <i className="fa fa-arrow-left" aria-hidden="true"></i>
                        <h2>Volver</h2>
                    </button>
                </section>
            </header>

            <div className="providers-content">
                <h1>Proveedores</h1>

                <input
                    placeholder="Buscar..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                <form onSubmit={handleSubmit}>
                    <input
                        name="nombre"
                        placeholder="Nombre"
                        value={formData.nombre}
                        onChange={e => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                        required
                    />
                    <input
                        name="telefono"
                        placeholder="Teléfono"
                        value={formData.telefono}
                        onChange={e => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
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
                    filtrados.map(p => (
                        <div className="provider-card" key={p.id}>
                            <p>{p.nombre}</p>
                            <button onClick={() => handleEditar(p)}>Editar</button>
                            {confirmandoId === p.id ? (
                                <section className="confirmar-eliminar">
                                    <span>¿Eliminar?</span>
                                    <button disabled={loadingDelete} onClick={() => eliminar(p.id, p.nombre)}>
                                        {loadingDelete ? "Eliminando..." : "Sí"}
                                    </button>
                                    <button disabled={loadingDelete} onClick={() => setConfirmandoId(null)}>
                                        No
                                    </button>
                                </section>
                            ) : (
                                <button onClick={() => setConfirmandoId(p.id)}>Eliminar</button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </main>
    )
}