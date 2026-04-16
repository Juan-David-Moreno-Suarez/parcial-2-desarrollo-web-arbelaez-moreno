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

export async function postResource(i, data) {
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
  const response = await fetch(`${API_URL}?resource=${resource}`, {
    method: "POST",
    headers: {"Content-Type": "text/plain"},
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Error al obtener productos');
  const json = await response.json();
  return json.data;
}

export async function updateResource(i, data) {
  let resource;
  switch (i) {
    case 1: resource = 'productos'; break;
    case 2: resource = 'ventas'; break;
    case 3: resource = 'compras'; break;
    case 4: resource = 'clientes'; break;
    case 5: resource = 'proveedores'; break;
    case 6: resource = 'categorias'; break;
  }

  const response = await fetch(`${API_URL}?resource=${resource}`, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ _action: "update", ...data })
  });
  if (!response.ok) throw new Error('Error al actualizar');
  const json = await response.json();
  return json.data;
}

export async function deleteResource(i, id) {
  let resource;
  switch (i) {
    case 1: resource = 'productos'; break;
    case 2: resource = 'ventas'; break;
    case 3: resource = 'compras'; break;
    case 4: resource = 'clientes'; break;
    case 5: resource = 'proveedores'; break;
    case 6: resource = 'categorias'; break;
  }

  const response = await fetch(`${API_URL}?resource=${resource}`, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ _action: "delete", id })
  });
  if (!response.ok) throw new Error('Error al eliminar');
  const json = await response.json();
  return json;
}