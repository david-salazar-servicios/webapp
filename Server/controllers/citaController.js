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
        let { id_solicitud, id_tecnico, datetime, estado } = req.body;
        estado = estado || 'En Agenda';

        // Check if a cita already exists with the same technician and datetime
        const existingCita = await pool.query(
            'SELECT * FROM cita WHERE id_tecnico = $1 AND datetime = $2',
            [id_tecnico, datetime]
        );

        if (existingCita.rows.length > 0) {
            return res.status(409).json({ message: 'Ya existe una cita para esta fecha y hora con este técnico' });
        }

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
        console.log(req.body)
        const { id_solicitud, id_tecnico, datetime, id_cita, estado } = req.body;

        // Update cita in the database
        const updatedCita = await pool.query(
            'UPDATE cita SET id_solicitud = $1, id_tecnico = $2, datetime = $3, estado = $4 WHERE id_cita = $5 RETURNING *',
            [id_solicitud, id_tecnico, datetime, estado, id_cita]
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

        console.log(req.params)
        const { id } = req.params;

        // Delete cita from the database
        await pool.query('DELETE FROM cita WHERE id_cita = $1', [id]);

        res.json({ message: 'Cita deleted successfully' });
    } catch (error) {
        console.error("Error deleting cita:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


const updateCitaEstado = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const queryResult = await pool.query(
            'UPDATE cita SET estado = $1 WHERE id_cita = $2 RETURNING *',
            [estado, id]
        );

        if (queryResult.rows.length === 0) {
            return res.status(404).json({ message: 'Cita not found' });
        }

        res.json(queryResult.rows[0]);
    } catch (error) {
        console.error('Error updating cita estado:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


module.exports = {
    getAllCitas,
    createCita,
    updateCita,
    updateCitaEstado,
    deleteCita
};
