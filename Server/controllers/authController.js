const pool = require('../db'); // Ajusta la ruta al archivo de configuración correcto
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const foundUser = await pool.query('SELECT * FROM usuario WHERE correo_electronico = $1', [email]);

        if (foundUser.rows.length === 0) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        const user = foundUser.rows[0];
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(foundUser.rows[0].contrasena, salt);
        const match = await bcrypt.compare(password.trim(), hash);

        if (!match) {
            return res.status(401).json({ message: "Unauthorized: Incorrect password" });
        }

        const roles = await pool.query(
            'SELECT roles.nombre FROM usuario_roles ' +
            'INNER JOIN roles ON usuario_roles.id_rol = roles.id_rol ' +
            'WHERE usuario_roles.id_usuario = $1', 
            [user.id_usuario]
        );

        const userRoles = roles.rows.map(role => role.nombre);

        const accessToken = jwt.sign(
            {
                UserInfo: {
                    userId: user.id_usuario,
                    username: user.nombre,
                    email: user.correo_electronico,
                    roles: userRoles,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        global.CURRENT_USER = {
            userId: user.id_usuario,
            username: user.nombre,
            email: user.correo_electronico,
            roles: userRoles,
        };
        

        const refreshToken = jwt.sign(
            { username: user.nombre,
              email: user.correo_electronico},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        // Configura el nuevo token de refresco después de la línea anterior
        res.cookie('jwt', refreshToken, {
            httpOnly: true, // La cookie solo es accesible por el servidor web
            secure: true, // Solo se enviará con una solicitud HTTPS
            sameSite: 'None', // Imprescindible si la cookie debe enviarse en solicitudes entre sitios
            maxAge: 7 * 24 * 60 * 60 * 1000 // Duración de la cookie
        });
        
        res.json({ accessToken });
                
    } catch (err) {
        console.error('SQL Error', err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
const refresh = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

    const refreshToken = cookies.jwt;

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ message: "Forbidden" });

        const foundUser = await pool.query('SELECT * FROM usuario WHERE LOWER(nombre) = LOWER($1)', [decoded.username]);
        if (foundUser.rows.length === 0) return res.status(401).json({ message: "Unauthorized" });

        const userRolesQuery = await pool.query(
            'SELECT roles.nombre FROM usuario_roles ' +
            'INNER JOIN roles ON usuario_roles.id_rol = roles.id_rol ' +
            'WHERE usuario_roles.id_usuario = $1', 
            [foundUser.rows[0].id_usuario]
        );

        const userRoles = userRolesQuery.rows.map(role => role.nombre);

        const accessToken = jwt.sign({
            UserInfo: {
                userId: foundUser.rows[0].id_usuario,
                username: foundUser.rows[0].nombre,
                email: foundUser.rows[0].correo_electronico,
                roles: userRoles,
            },
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

        res.json({ accessToken });
    });
};
const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    });
    res.json({ message: "Cookie cleared" });
};

module.exports = {
    login, refresh, logout
};
