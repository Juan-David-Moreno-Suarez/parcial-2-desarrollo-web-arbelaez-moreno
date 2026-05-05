export function validateClient(data, original = null) {

    if (!data.nombre || data.nombre.trim() === '') {
        throw new Error('El nombre es obligatorio')
    }

    if (data.email && !data.email.includes('@')) {
        throw new Error('Email inválido')
    }

    if (data.telefono) {
        const telefonoStr = data.telefono.toString().trim()

        if (!/^\d+$/.test(telefonoStr)) {
            throw new Error('El teléfono debe contener solo números')
        }

        const telefonoNum = Number(telefonoStr)

        if (!Number.isInteger(telefonoNum)) {
            throw new Error('El teléfono debe ser un número entero')
        }

        if (telefonoStr.length < 6) {
            throw new Error('Teléfono demasiado corto')
        }
    }

    if (original) {
        const mismoNombre = (data.nombre || '').trim() === (original.nombre || '').trim()
        const mismoEmail = (data.email || '').trim() === (original.email || '').trim()
        const mismoTelefono = (data.telefono || '').toString().trim() === (original.telefono || '').toString().trim()

        if (mismoNombre && mismoEmail && mismoTelefono) {
            throw new Error('No hiciste ningún cambio. Presiona cancelar si no deseas modificar el cliente')
        }
    }
}