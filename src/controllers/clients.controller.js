import { fetchResource, postResource, updateResource, deleteResource } from '../services/api'
import { validateClient } from '../validators/client.validator'
import { sanitizeClient } from '../middlewares/sanitizeData'

export async function getClients() {
    return await fetchResource(4)
}

export async function createClient(data, existingClients = []) {

    const clean = sanitizeClient(data)

    validateClient(clean)

    const existe = existingClients.some(
        c => c.nombre.trim().toLowerCase() === clean.nombre.trim().toLowerCase()
    )

    if (existe) {
        throw new Error('Este cliente ya existe')
    }

    return await postResource(4, clean)
}

export async function editClient(data, originalClient) {

    const clean = sanitizeClient(data)

    validateClient(clean, originalClient)

    return await updateResource(4, clean)
}

export async function removeClient(id) {
    return await deleteResource(4, id)
}