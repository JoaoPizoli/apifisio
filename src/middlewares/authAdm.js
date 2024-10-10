require('dotenv').config();
const jwt = require('jsonwebtoken');
const revokedTokens = require('../middlewares/tokenmanager'); 

module.exports = function(req, res, next) {
    const authToken = req.headers['authorization'];

    if (!authToken) {
        return res.status(403).json({
            success: false,
            message: 'Usuário não Autenticado'
        });
    } else {
        const bearer = authToken.split(' ');
        const token = bearer[1];

        if (revokedTokens.has(token)) {
            return res.status(403).json({
                success: false,
                message: 'Token inválido'
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            req.paciente = decoded; 
            next();
        } catch (err) {
            return res.status(403).json({
                success: false,
                message: 'Usuário não Autenticado'
            });
        }
    }
};
