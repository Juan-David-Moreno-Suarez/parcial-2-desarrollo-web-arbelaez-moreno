const { RequestLog } = require('../models/index.cjs');

module.exports = async (req, res, next) => {
    try {

        await RequestLog.create({
            method: req.method,          
            path: req.originalUrl,        
            ip: req.ip
        });
    } catch (err) {
        console.error('Error guardando log de petición:', err);
    }
    next();
};