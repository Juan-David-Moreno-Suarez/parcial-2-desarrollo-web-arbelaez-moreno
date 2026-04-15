export function safeArray(key) {
  const data = JSON.parse(localStorage.getItem(key))
  return Array.isArray(data) ? data : []
}

export function guardarProductos(productos) {
  localStorage.setItem('productos', JSON.stringify(productos))
}

export function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito))
}

export function guardarVentas(ventas) {
  localStorage.setItem('ventas', JSON.stringify(ventas))
}

export function guardarTodo({ productos, carrito, ventas }) {
  localStorage.setItem('productos', JSON.stringify(productos))
  localStorage.setItem('carrito', JSON.stringify(carrito))
  localStorage.setItem('ventas', JSON.stringify(ventas))
}