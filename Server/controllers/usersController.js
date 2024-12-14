const pool = require('../db'); // Ajusta la ruta según sea necesario.
const bcrypt = require("bcryptjs");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
    try {
        // Execute the SQL query to fetch all users
        const queryResult = await pool.query('SELECT * FROM usuario');

        // Extract the user data from the query result
        const users = queryResult.rows;

        // Return the list of users
        res.json(users);
    } catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// @desc Create a new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
    try {
        const { nombre, apellido, correo_electronico, contrasena, telefono } = req.body;

        // Hash the password
        const saltRounds = 10; // Use bcrypt salt rounds
        const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

        // Insert the new user with the hashed password
        const newUser = await pool.query(
            'INSERT INTO usuario (nombre, apellido, correo_electronico, contrasena, telefono) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre, apellido, correo_electronico, hashedPassword, telefono]
        );

        res.json(newUser.rows[0]);
    } catch (error) {
        console.error("Error creating new user:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


// @desc Delete a user by ID
// @route DELETE /users/:id
// @access Private
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM usuario_roles WHERE id_usuario = $1', [id]);
        await pool.query('DELETE FROM usuario WHERE id_usuario = $1', [id]);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// @desc Get a single user by ID
// @route GET /users/:id
// @access Private
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the user from the database
        const userResult = await pool.query('SELECT * FROM usuario WHERE id_usuario = $1', [id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userResult.rows[0];

        // Do NOT include the hashed password in the response
        delete user.contrasena;

        res.json(user);
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// @desc Update a user by ID
// @route PUT /users/:id
// @access Private
const updateUser = async (req, res) => {
    try {
        const { id } = req.params; // User ID from request parameters
        let { nombre, apellido, correo_electronico, contrasena, telefono } = req.body;

        // Check if the password is being updated and hash it
        if (contrasena) {
            const saltRounds = 10; // Recommended salt rounds
            contrasena = await bcrypt.hash(contrasena, saltRounds);
        }

        // Perform the SQL update query
        const updatedUser = await pool.query(
            'UPDATE usuario SET nombre = $1, apellido = $2, correo_electronico = $3, contrasena = $4, telefono = $5 WHERE id_usuario = $6 RETURNING *',
            [nombre, apellido, correo_electronico, contrasena, telefono, id]
        );

        // Check if the user exists
        if (updatedUser.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser.rows[0]); // Respond with the updated user
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
const assignRoleToUser = async (req, res) => {
    try {
        const { id } = req.params; // Este es el id_usuario
        const { id_rol } = req.body; // Asegúrate de que se envía este campo en el cuerpo de la solicitud

        // Verificar primero si la combinación de usuario y rol ya existe para evitar duplicados
        const existingRole = await pool.query(
            'SELECT * FROM usuario_roles WHERE id_usuario = $1 AND id_rol = $2', 
            [id, id_rol]
        );

        if (existingRole.rows.length > 0) {
            return res.status(400).json({ message: 'El usuario ya tiene asignado este rol' });
        }

        // Insertar la nueva combinación de usuario y rol
        const newUserRole = await pool.query(
            'INSERT INTO usuario_roles (id_usuario, id_rol) VALUES ($1, $2) RETURNING *',
            [id, id_rol]
        );

        res.json({ message: 'Rol asignado correctamente al usuario', data: newUserRole.rows[0] });
    } catch (error) {
        console.error("Error assigning role to user:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
// @desc Get user role by user ID
// @route GET /users/:id/role
// @access Private
const getUserRole = async (req, res) => {
    try {
        const { id } = req.params; // Este es el id_usuario

        // Realizar la consulta para unir las tablas usuario, usuario_roles y roles
        const result = await pool.query(
            'SELECT roles.id_rol, roles.nombre, roles.descripcion FROM usuario ' +
            'JOIN usuario_roles ON usuario.id_usuario = usuario_roles.id_usuario ' +
            'JOIN roles ON usuario_roles.id_rol = roles.id_rol ' +
            'WHERE usuario.id_usuario = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Rol no encontrado para este usuario' });
        }

        res.json(result.rows); // Envía la información del rol del usuario
    } catch (error) {
        console.error("Error retrieving user's role:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const updateUserRoles = async (req, res) => {
    const { id } = req.params; // id del usuario
    const { roles } = req.body; // un array de ids de roles

    try {
        await pool.query('BEGIN');
        await pool.query('DELETE FROM usuario_roles WHERE id_usuario = $1', [id]);

        for (const id_rol of roles) {
            await pool.query('INSERT INTO usuario_roles (id_usuario, id_rol) VALUES ($1, $2)', [id, id_rol]);
        }

        await pool.query('COMMIT');
        res.json({ message: 'Roles del usuario actualizados correctamente' });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error("Error updating user's roles:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
const updateUserPassword = async (req, res) => {
    const { id, newPassword, tempPassword } = req.body;

    try {
        // Fetch the current password from the database
        const userResult = await pool.query('SELECT contrasena FROM usuario WHERE id_usuario = $1', [id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const currentHashedPassword = userResult.rows[0].contrasena;

        // Compare the provided temporary password with the current hashed password
        const isMatch = await bcrypt.compare(tempPassword, currentHashedPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Contraseña temporal no es correcta" });
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the password in the database
        const updatedPassword = await pool.query(
            'UPDATE usuario SET contrasena = $1, password_reset = false WHERE id_usuario = $2 RETURNING *',
            [hashedNewPassword, id]
        );

        res.json({ message: "Contraseña actualizada con éxito!", user: updatedPassword.rows[0] });
    } catch (error) {
        console.error("Error updating user's password:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = {
    getAllUsers,
    createNewUser,
    deleteUser,
    getUserById,
    updateUser,
    assignRoleToUser,
    getUserRole,
    updateUserRoles,
    updateUserPassword
};
