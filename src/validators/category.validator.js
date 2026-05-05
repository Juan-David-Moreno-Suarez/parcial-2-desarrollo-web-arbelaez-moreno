export function validateCategory(data) {

    if (!data.nombre || data.nombre.trim() === '') {
        throw new Error('El nombre es obligatorio')
    }

    if (data.nombre.trim().length < 3) {
        throw new Error('El nombre es demasiado corto')
    }

}