import { useEffect, useState } from "react"
import { fetchResource, postResource, updateResource, deleteResource } from "../services/api"
import { Link } from "react-router-dom"
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import '../styles/clients.css'

export default function Clients() {

    const [clients, setClients] = useState([])
    const [search, setSearch] = useState('')
    const [editing, setEditing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadingSave, setLoadingSave] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [confirmandoId, setConfirmandoId] = useState(null)
    const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '' })

    useEffect(() => {
        loadClients()
    }, [])

    async function loadClients() {
        setLoading(true)
        const data = await fetchResource(4)
        setClients(data)
        setLoading(false)
    }

    function handleEditar(c) {
        setEditing(c)
        setFormData({ nombre: c.nombre, email: c.email || '', telefono: c.telefono || '' })
    }

    function handleCancelar() {
        setEditing(null)
        setFormData({ nombre: '', email: '', telefono: '' })
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const data = {
            id: editing ? editing.id : crypto.randomUUID(),
            nombre: formData.nombre,
            email: formData.email,
            telefono: formData.telefono
        }

        if (!editing) {
            const existe = clients.some(
                c => c.nombre.trim().toLowerCase() === data.nombre.trim().toLowerCase()
            )
            if (existe) {
                Toastify({ text: "Este cliente ya existe", duration: 3000, style: { background: "#c0392b" } }).showToast()
                return
            }
        }

        try {
            setLoadingSave(true)
            if (editing) {
                await updateResource(4, data)
                Toastify({ text: "Cliente editado", duration: 2000 }).showToast()
            } else {
                await postResource(4, data)
                Toastify({ text: "Cliente creado", duration: 2000 }).showToast()
            }
            setEditing(null)
            setFormData({ nombre: '', email: '', telefono: '' })
            loadClients()
        } catch {
            Toastify({ text: "Error", duration: 2000 }).showToast()
        } finally {
            setLoadingSave(false)
        }
    }

    async function eliminar(id, nombre) {
        setLoadingDelete(true)
        await deleteResource(4, id)
        await loadClients()
        setConfirmandoId(null)
        setLoadingDelete(false)
        Toastify({ text: `Se ha eliminado el cliente ${nombre}`, duration: 2000 }).showToast()
    }

    const filtrados = clients.filter(c =>
        c.nombre.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="clients-container">
            <header>
                <Link to="/">
                    <i className="fa fa-arrow-left" aria-hidden="true"></i>
                    <h2>Volver</h2>
                </Link>
            </header>

            <div className="clients-content">
                <h1>Clientes</h1>

                <input
                    placeholder="Buscar cliente..."
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
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
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
                    filtrados.map(c => (
                        <div className="client-card" key={c.id}>
                            <div className="client-info">
                                <p>{c.nombre}</p>
                                {c.email && <p>{c.email}</p>}
                                {c.telefono && <p>{c.telefono}</p>}
                            </div>
                            <div className="client-actions">
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