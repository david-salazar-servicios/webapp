const pool = require('../db'); // Ajusta la ruta según sea necesario.

// @desc Get all roles
// @route GET /roles
// @access Private
const getAllRoles = async (req, res) => {
    try {
        // Execute the SQL query to fetch all roles
        const queryResult = await pool.query('SELECT * FROM roles');

        // Extract the role data from the query result
        const roles = queryResult.rows;

        // Return the list of roles
        res.json(roles);
    } catch (error) {
        console.error("Error retrieving roles:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// @desc Create a new role
// @route POST /roles
// @access Private
const createNewRole = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const newRole = await pool.query(
            'INSERT INTO roles (nombre, descripcion) VALUES ($1, $2) RETURNING *', 
            [nombre, descripcion]
        );

        res.json(newRole.rows[0]);
    } catch (error) {
        console.error("Error creating new role:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// @desc Delete a role by ID
// @route DELETE /roles/:id
// @access Private
const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM roles WHERE id_rol = $1', [id]);

        res.json({ message: 'Role deleted successfully' });
    } catch (error) {
        console.error("Error deleting role:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// @desc Get a single role by ID
// @route GET /roles/:id
// @access Private
const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await pool.query('SELECT * FROM roles WHERE id_rol = $1', [id]);

        if (role.rows.length === 0) {
            return res.status(404).json({ message: 'Role not found' });
        }

        res.json(role.rows[0]);
    } catch (error) {
        console.error("Error retrieving role:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// @desc Update a role by ID
// @route PUT /roles/:id
// @access Private
const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        const updatedRole = await pool.query(
            'UPDATE roles SET nombre = $1, descripcion = $2 WHERE id_rol = $3 RETURNING *',
            [nombre, descripcion, id]
        );

        if (updatedRole.rows.length === 0) {
            return res.status(404).json({ message: 'Role not found' });
        }

        res.json(updatedRole.rows[0]);
    } catch (error) {
        console.error("Error updating role:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = {
    getAllRoles,
    createNewRole,
    deleteRole,
    getRoleById,
    updateRole
};
