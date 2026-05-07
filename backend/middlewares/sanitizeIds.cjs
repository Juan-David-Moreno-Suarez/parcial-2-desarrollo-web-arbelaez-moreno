function stripIdSuffixes(data) {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data !== 'object') {
    return data;
  }

  if (data instanceof Date) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => stripIdSuffixes(item));
  }

  const cleaned = {};

  for (const [key, value] of Object.entries(data)) {

    if (key.endsWith('Id') || key.endsWith('_id')) {
      continue;
    }

    if (key === 'uniqno' || key === 'isNewRecord') {
      continue;
    }

    cleaned[key] = stripIdSuffixes(value);
  }

  return cleaned;
}

module.exports = (req, res, next) => {

  const originalJson = res.json.bind(res);

  res.json = (body) => {
    try {

      const plainBody = JSON.parse(JSON.stringify(body));
      
      const sanitizedBody = stripIdSuffixes(plainBody);
      
      return originalJson(sanitizedBody);
    } catch (error) {
      console.error('Error en sanitizeIds:', error);

      return originalJson(body);
    }
  };

  next();
};