// solicitudController.js
const socketManager = require('../socket'); // Adjust the path as necessary
const pool = require('../db');
// solicitudController.js
const moment = require('moment-timezone');
const getAllSolicitudes = async (req, res) => {
    
    try {
        // Execute the SQL query to fetch all services
        const queryResult = await pool.query('SELECT * FROM solicitud');

        // Extract the service data from the query result
        const solicitudes = queryResult.rows; 

        // Return the list of services
        res.json(solicitudes);
    } catch (error) {
        console.error("Error retrieving services:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};



const crearSolicitud_AgregarServicios = async (req, res) => {
    try {
        let { fecha_creacion, estado, id_usuario, nombre, apellido, correo_electronico, telefono, observacion, fecha_preferencia, servicios } = req.body;
        fecha_preferencia = moment(fecha_preferencia).tz('America/Costa_Rica').format();

        const newSolicitud = await pool.query(
            'INSERT INTO solicitud (fecha_creacion, estado, id_usuario, nombre, apellido, correo_electronico, telefono, observacion, fecha_preferencia) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [fecha_creacion, estado, id_usuario, nombre, apellido, correo_electronico, telefono, observacion, fecha_preferencia]
        );

        const solicitudId = newSolicitud.rows[0].id_solicitud;

        for (const servicioId of servicios) {
            await pool.query(
                'INSERT INTO detalleSolicitud (id_solicitud, id_servicio) VALUES ($1, $2)',
                [solicitudId, servicioId]
            );
        }

        const fullSolicitudDetails = await getSolicitudByIdForEmit(solicitudId); // Get the full details
        const io = socketManager.getIO();

        io.emit('solicitudCreada', {
            message: 'Nueva solicitud creada',
            solicitud: fullSolicitudDetails // Emit the full details
        });

        res.json({
            message: 'Solicitud y servicios agregados correctamente',
            solicitud: fullSolicitudDetails
        });

    } catch (error) {
        console.error("Error creating solicitud and adding servicios:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const getSolicitudById = async (req, res) => {
    try {
        const { solicitudId } = req.params;
        // Fetch solicitud data
        const solicitudQuery = await pool.query('SELECT * FROM solicitud WHERE id_solicitud = $1', [solicitudId]);
        const solicitud = solicitudQuery.rows[0];
        
        // Fetch servicios (details)
        const detallesQuery = await pool.query(
            'SELECT ds.id_detalle_solicitud, ds.id_servicio, s.nombre AS servicio_nombre, s.descripcion AS servicio_descripcion ' +
            'FROM detallesolicitud ds ' +
            'JOIN servicios s ON ds.id_servicio = s.id_servicio ' +
            'WHERE ds.id_solicitud = $1', [solicitudId]);

        const detalles = detallesQuery.rows;

        res.json({
            ...solicitud,
            detalles
        });
    } catch (error) {
        console.error("Error retrieving solicitud by id:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
const updateSolicitudEstado = async (req, res) => {
    const { solicitudId } = req.params;
    const { estado } = req.body;

    try {
        // Update the estado of the solicitud
        const queryResult = await pool.query(
            'UPDATE solicitud SET estado = $1 WHERE id_solicitud = $2 RETURNING *',
            [estado, solicitudId]
        );

        if (queryResult.rows.length === 0) {
            return res.status(404).json({ message: 'Solicitud not found' });
        }

        res.json(queryResult.rows[0]);
    } catch (error) {
        console.error("Error updating solicitud estado:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
const getSolicitudByIdForEmit = async (solicitudId) => {
    const solicitudQuery = await pool.query('SELECT * FROM solicitud WHERE id_solicitud = $1', [solicitudId]);
    const solicitud = solicitudQuery.rows[0];

    const detallesQuery = await pool.query(
        'SELECT ds.id_detalle_solicitud, ds.id_servicio, s.nombre AS servicio_nombre, s.descripcion AS servicio_descripcion ' +
        'FROM detallesolicitud ds ' +
        'JOIN servicios s ON ds.id_servicio = s.id_servicio ' +
        'WHERE ds.id_solicitud = $1', [solicitudId]);

    const detalles = detallesQuery.rows;

    return { ...solicitud, detalles };
};

const updateSolicitudFechaPreferencia = async (req, res) => {
    const { solicitudId } = req.params;
    const { fecha_preferencia } = req.body;

    try {
        // Format the fecha_preferencia using moment-timezone
        const formattedFechaPreferencia = moment(fecha_preferencia).tz('America/Costa_Rica').format();

        // Update the fecha_preferencia field in the solicitud
        const queryResult = await pool.query(
            'UPDATE solicitud SET fecha_preferencia = $1 WHERE id_solicitud = $2 RETURNING *',
            [formattedFechaPreferencia, solicitudId]
        );

        if (queryResult.rowCount === 0) {
            return res.status(404).json({ message: 'Solicitud not found' });
        }

        // Fetch and return the updated solicitud details
        const updatedSolicitud = await getSolicitudByIdForEmit(solicitudId);

        res.json(updatedSolicitud);
    } catch (error) {
        console.error("Error updating solicitud fecha_preferencia:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = {
    crearSolicitud_AgregarServicios,
    getAllSolicitudes,
    getSolicitudById,
    updateSolicitudEstado,
    updateSolicitudFechaPreferencia 
};
