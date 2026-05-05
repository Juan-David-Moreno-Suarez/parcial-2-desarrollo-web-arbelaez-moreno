import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

export function handleError(error, customMessage = '') {

    console.error('Error:', error)

    let message = customMessage || 'Error inesperado'

    if (error?.message) {
        message = error.message
    }

    if (error?.message?.includes('Failed to fetch')) {
        message = 'No se pudo conectar con la API'
    }

    if (error?.message?.includes('Unexpected token')) {
        message = 'Respuesta inválida del servidor'
    }

    Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: 'top',
        position: 'center',
        style: {
            background: '#ca222a'
        }
    }).showToast()
}