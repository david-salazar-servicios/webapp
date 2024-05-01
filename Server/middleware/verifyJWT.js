const jwt = require('jsonwebtoken');
const pool = require('../db'); // Ajusta la ruta al archivo de configuración correcto

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        req.user = decoded.UserInfo;
        next();
    });
};

const isAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        
        const userId = decoded.UserInfo.userId;

        try {
            const userRolesResult = await pool.query(
                'SELECT roles.nombre FROM usuario_roles ' +
                'INNER JOIN roles ON usuario_roles.id_rol = roles.id_rol ' +
                'WHERE usuario_roles.id_usuario = $1', 
                [userId]
            );

            const roles = userRolesResult.rows.map(row => row.nombre.toLowerCase());

            if (!roles.includes('admin')) { // Asegúrate de que esto esté en minúsculas
                return res.status(403).json({ message: 'Require Admin Role' });
            }
            

            req.user = decoded.UserInfo; // Pass user info to the next middleware
            next();
        } catch (error) {
            console.error('Database error', error); // Cambio aquí para un registro más detallado
            return res.status(500).json({ message: 'Database error', error: error.message });
        }
    });
};

module.exports = { verifyJWT, isAdmin };
