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

        // Convert fecha_preferencia to the correct timezone
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
        
        const io = socketManager.getIO();

        // Emitir un evento a todos los clientes conectados
        io.emit('solicitudCreada', {
            message: 'Nueva solicitud creada',
            solicitud: newSolicitud.rows[0],
            servicios: servicios
        });
        res.json({
            message: 'Solicitud y servicios agregados correctamente',
            solicitud: newSolicitud.rows[0],
            servicios: servicios
        });

    } catch (error) {
        console.error("Error creating solicitud and adding servicios:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};



module.exports = {
    crearSolicitud_AgregarServicios,
    getAllSolicitudes
};
