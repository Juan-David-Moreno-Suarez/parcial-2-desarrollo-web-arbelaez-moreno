import { fetchResource, postResource, updateResource, deleteResource } from '../services/api'
import { validateCategory } from '../validators/category.validator'
import { sanitizeCategory } from '../middlewares/sanitizeData'

export async function getCategories() {
    return await fetchResource(6)
}

export async function createCategory(data, existing = []) {

    const clean = sanitizeCategory(data)

    validateCategory(clean)

    const existe = existing.some(
        c => c.nombre.trim().toLowerCase() === clean.nombre.trim().toLowerCase()
    )

    if (existe) {
        throw new Error('Esta categoría ya existe')
    }

    return await postResource(6, clean)
}

export async function editCategory(data) {

    const clean = sanitizeCategory(data)

    validateCategory(clean)

    return await updateResource(6, clean)
}

export async function removeCategory(id) {
    return await deleteResource(6, id)
}