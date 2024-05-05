const pool = require('../db'); // Adjust the path as necessary

// @desc Get all citas
// @route GET /citas
// @access Private
// @desc Get all citas
// @route GET /citas
// @access Private
const getAllCitas = async (req, res) => {
    try {
        // Fetch all citas and join with solicitud and usuario details
        const query = `
        SELECT 
        c.*, 
        s.*, 
        u.nombre AS tecnico_nombre, 
        u.apellido AS tecnico_apellido
    FROM 
        cita c
    JOIN 
        solicitud s ON c.id_solicitud = s.id_solicitud
    JOIN 
        usuario u ON c.id_tecnico = u.id_usuario;
    
        `;
        const queryResult = await pool.query(query);
        const citas = queryResult.rows;
        res.json(citas);
    } catch (error) {
        console.error("Error retrieving citas with usuario details:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// @desc Create a new cita
// @route POST /citas
// @access Private
const createCita = async (req, res) => {
    try {
        // Extract fields from request body
        let { id_solicitud, id_tecnico, datetime, estado } = req.body;

        // Provide a default value for estado if not provided
        estado = estado || 'En Agenda';

        // Insert the new cita into the database
        const newCita = await pool.query(
            'INSERT INTO cita (id_solicitud, id_tecnico, datetime, estado) VALUES ($1, $2, $3, $4) RETURNING *',
            [id_solicitud, id_tecnico, datetime, estado]
        );

        res.status(201).json(newCita.rows[0]);
    } catch (error) {
        console.error('Error creating cita:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};



// @desc Update a cita by ID
// @route PUT /citas/:id
// @access Private
const updateCita = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_solicitud, id_tecnico, datetime, estado } = req.body;

        // Update cita in the database
        const updatedCita = await pool.query(
            'UPDATE cita SET id_solicitud = $1, id_tecnico = $2, datetime = $3, estado = $4 WHERE id_cita = $5 RETURNING *',
            [id_solicitud, id_tecnico, datetime, estado, id]
        );

        if (updatedCita.rows.length === 0) {
            return res.status(404).json({ message: 'Cita not found' });
        }

        res.json({
            message: 'Cita updated successfully',
            cita: updatedCita.rows[0]
        });
    } catch (error) {
        console.error("Error updating cita:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// @desc Delete a cita by ID
// @route DELETE /citas/:id
// @access Private
const deleteCita = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete cita from the database
        await pool.query('DELETE FROM cita WHERE id_cita = $1', [id]);

        res.json({ message: 'Cita deleted successfully' });
    } catch (error) {
        console.error("Error deleting cita:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = {
    getAllCitas,
    createCita,
    updateCita,
    deleteCita
};
