import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import '../styles/clients.css'

import { getClients, createClient, editClient, removeClient } from '../controllers/clients.controller'
import { handleError } from '../middlewares/errorHandler'

export default function Clients() {

    const [clients, setClients] = useState([])
    const [search, setSearch] = useState('')
    const [editing, setEditing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadingSave, setLoadingSave] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [confirmandoId, setConfirmandoId] = useState(null)
    const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '' })

    const navigate = useNavigate()

    useEffect(() => {
        loadClients()
    }, [])

    async function loadClients() {
        try {
            setLoading(true)
            const data = await getClients()
            setClients(data)
        } catch (e) {
            handleError(e)
        } finally {
            setLoading(false)
        }
    }

    function handleEditar(c) {
        setEditing(c)
        setFormData({
            nombre: c.nombre,
            email: c.email || '',
            telefono: c.telefono || ''
        })
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

        try {
            setLoadingSave(true)

            if (editing) {
                await editClient(data, editing)
                Toastify({ text: "Cliente editado", duration: 2000 }).showToast()
            } else {
                await createClient(data, clients)
                Toastify({ text: "Cliente creado", duration: 2000 }).showToast()
            }

            setEditing(null)
            setFormData({ nombre: '', email: '', telefono: '' })
            loadClients()

        } catch (e) {
            handleError(e)
        } finally {
            setLoadingSave(false)
        }
    }

    async function eliminar(id, nombre) {
        try {
            setLoadingDelete(true)
            await removeClient(id)
            await loadClients()
            setConfirmandoId(null)

            Toastify({
                text: `Se ha eliminado el cliente ${nombre}`,
                duration: 2000
            }).showToast()

        } catch (e) {
            handleError(e)
        } finally {
            setLoadingDelete(false)
        }
    }

    const filtrados = clients.filter(c =>
        c.nombre.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="clients-container">
            <header>
                <button onClick={() => navigate(-1)}>
                    <i className="fa fa-arrow-left"></i>
                    <h2>Volver</h2>
                </button>
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
                        placeholder="Nombre"
                        value={formData.nombre}
                        onChange={e => setFormData(p => ({ ...p, nombre: e.target.value }))}
                        required
                    />

                    <input
                        placeholder="Email"
                        value={formData.email}
                        onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    />

                    <input
                        placeholder="Teléfono"
                        value={formData.telefono}
                        onChange={e => setFormData(p => ({ ...p, telefono: e.target.value }))}
                    />

                    <button disabled={loadingSave}>
                        {loadingSave ? "Guardando..." : editing ? "Guardar" : "Crear"}
                    </button>

                    {editing && (
                        <button type="button" onClick={handleCancelar}>
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
                                        <button onClick={() => setConfirmandoId(null)}>
                                            No
                                        </button>
                                    </section>
                                ) : (
                                    <button onClick={() => setConfirmandoId(c.id)}>
                                        Eliminar
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}