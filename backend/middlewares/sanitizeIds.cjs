/**
 * Middleware POST-PROCESAMIENTO
 * Elimina campos que terminan en 'Id' o '_id' de las respuestas JSON
 * Se ejecuta DESPUÉS de los controladores (intercepta res.json)
 */

function stripIdSuffixes(data) {
  // Si es un valor primitivo o null/undefined, devolverlo tal cual
  if (data === null || data === undefined) {
    return data;
  }

  // Si es un tipo primitivo (string, number, boolean), devolverlo
  if (typeof data !== 'object') {
    return data;
  }

  // Si es una fecha, devolverla tal cual
  if (data instanceof Date) {
    return data;
  }

  // Si es un array, procesar cada elemento recursivamente
  if (Array.isArray(data)) {
    return data.map(item => stripIdSuffixes(item));
  }

  // Si es un objeto, procesar sus propiedades
  const cleaned = {};

  for (const [key, value] of Object.entries(data)) {
    // Saltar campos que terminan en 'Id' o '_id'
    if (key.endsWith('Id') || key.endsWith('_id')) {
      continue;
    }

    // Saltar propiedades internas que no son datos reales
    if (key === 'uniqno' || key === 'isNewRecord') {
      continue;
    }

    // Procesar recursivamente el valor
    cleaned[key] = stripIdSuffixes(value);
  }

  return cleaned;
}

module.exports = (req, res, next) => {
  // Guardar la función original res.json
  const originalJson = res.json.bind(res);

  // Reemplazar res.json con una versión que sanitiza antes de enviar
  res.json = (body) => {
    try {
      // Convertir a JSON plano primero (serializa objetos de Sequelize)
      const plainBody = JSON.parse(JSON.stringify(body));
      
      // Luego sanitizar
      const sanitizedBody = stripIdSuffixes(plainBody);
      
      return originalJson(sanitizedBody);
    } catch (error) {
      console.error('❌ Error en sanitizeIds:', error);
      // Si falla, intentar enviar el body original
      return originalJson(body);
    }
  };

  // Continuar con la siguiente función
  next();
};