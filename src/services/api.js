const API_URL = import.meta.env.VITE_API_URL;

export async function fetchResource(i) {
  let resource;
  switch (i) {
    case 1: resource = 'productos';
      break;
    case 2: resource = 'ventas';
      break;
    case 3: resource = 'compras';
    break;
    case 4: resource = 'clientes';
    break;
    case 5: resource = 'proveedores';
    break;
    case 6: resource = 'categorias';

  }
  const response = await fetch(`${API_URL}?resource=${resource}`);
  if (!response.ok) throw new Error('Error al obtener productos');
  const json = await response.json();
  return json.data;
}