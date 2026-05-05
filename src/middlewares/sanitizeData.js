export function sanitizeString(value) {
    if (value === null || value === undefined) return ''
    return value.toString().trim()
}

export function sanitizeNumber(value) {
    const num = Number(value)
    return isNaN(num) ? 0 : num
}

export function sanitizeObject(obj) {
    const clean = {}

    for (let key in obj) {
        let value = obj[key]

        if (typeof value === 'string') {
            clean[key] = sanitizeString(value)
        } else if (typeof value === 'number') {
            clean[key] = sanitizeNumber(value)
        } else if (value === null || value === undefined) {
            clean[key] = ''
        } else {
            clean[key] = value
        }
    }

    return clean
}

export function sanitizeClient(data) {
    return {
        id: data.id,
        nombre: sanitizeString(data.nombre),
        email: sanitizeString(data.email),
        telefono: sanitizeString(data.telefono)
    }
}

export function sanitizeProduct(data) {
    return {
        id: data.id,
        nombre: sanitizeString(data.nombre),
        descripcion: sanitizeString(data.descripcion),
        precio: sanitizeNumber(data.precio),
        stock: sanitizeNumber(data.stock),
        imagen: sanitizeString(data.imagen)
    }
}