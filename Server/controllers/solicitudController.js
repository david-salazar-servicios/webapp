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
        let {
            fecha_creacion, estado, id_usuario, nombre, apellido, correo_electronico,
            telefono, telefono_fijo, direccion, observacion, fecha_preferencia, servicios
        } = req.body;

        fecha_preferencia = moment(fecha_preferencia).tz('America/Costa_Rica').format();

        // Insert into the solicitud table
        const newSolicitud = await pool.query(
            'INSERT INTO solicitud (fecha_creacion, estado, id_usuario, nombre, apellido, correo_electronico, telefono, telefono_fijo, direccion, observacion, fecha_preferencia) ' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
            [fecha_creacion, estado, id_usuario, nombre, apellido, correo_electronico, telefono, telefono_fijo, direccion, observacion, fecha_preferencia]
        );

        const solicitudId = newSolicitud.rows[0].id_solicitud;

        // Iterate through each service and its selected offers
        for (const { id_servicio, selectedOffers } of servicios) {
            // If there are selected offers for this service, insert them
            for (const offer of selectedOffers) {
                await pool.query(
                    'INSERT INTO detalleSolicitud (id_solicitud, id_servicio, detalle) VALUES ($1, $2, $3)',
                    [solicitudId, id_servicio, offer]
                );
            }
        }

        // Fetch full details of the solicitud after insertion
        const fullSolicitudDetails = await getSolicitudByIdForEmit(solicitudId);
        const io = socketManager.getIO();

        // Emit the newly created solicitud
        io.emit('solicitudCreada', {
            message: 'Nueva solicitud creada',
            solicitud: fullSolicitudDetails
        });

        // Respond with success and full solicitud details
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

        if (!solicitud) {
            return res.status(404).json({ message: "Solicitud not found" });
        }

        // Fetch related cita (optional for creation)
        const citaQuery = await pool.query('SELECT * FROM cita WHERE id_solicitud = $1', [solicitudId]);
        const cita = citaQuery.rows[0];

        let tecnico = null;
        if (cita) {
            // Fetch tecnico details if cita exists
            const tecnicoQuery = await pool.query('SELECT id_usuario, nombre, apellido FROM usuario WHERE id_usuario = $1', [cita.id_tecnico]);
            tecnico = tecnicoQuery.rows[0];
        }

        // Fetch servicios and their related detalles
        const detallesQuery = await pool.query(
            'SELECT ds.detalle, ds.id_servicio, s.nombre AS servicio_nombre ' +
            'FROM detallesolicitud ds ' +
            'JOIN servicios s ON ds.id_servicio = s.id_servicio ' +
            'WHERE ds.id_solicitud = $1', [solicitudId]
        );

        const detalles = detallesQuery.rows;

        // Grouping the results by id_servicio
        const groupedServicios = detalles.reduce((acc, detalle) => {
            const { id_servicio, servicio_nombre, detalle: detalleTexto } = detalle;

            if (!acc[id_servicio]) {
                acc[id_servicio] = {
                    id_servicio,
                    servicio_nombre,
                    detalles: []
                };
            }

            acc[id_servicio].detalles.push(detalleTexto);

            return acc;
        }, {});

        const serviciosArray = Object.values(groupedServicios);

        // Respond with the solicitud data
        res.json({
            ...solicitud,
            tecnico: tecnico ? { nombre: tecnico.nombre, apellido: tecnico.apellido , id: tecnico.id_usuario} : null,
            servicios: serviciosArray
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
    // Fetch solicitud data
    const solicitudQuery = await pool.query('SELECT * FROM solicitud WHERE id_solicitud = $1', [solicitudId]);
    const solicitud = solicitudQuery.rows[0];

    // Fetch servicios and their related detalles
    const detallesQuery = await pool.query(
        'SELECT ds.detalle, ds.id_servicio, s.nombre AS servicio_nombre ' +
        'FROM detallesolicitud ds ' +
        'JOIN servicios s ON ds.id_servicio = s.id_servicio ' +
        'WHERE ds.id_solicitud = $1', [solicitudId]);

    const detalles = detallesQuery.rows;

    // Grouping the results by id_servicio
    const groupedServicios = detalles.reduce((acc, detalle) => {
        const { id_servicio, servicio_nombre, detalle: detalleTexto } = detalle;

        // Check if the service already exists in the accumulator
        if (!acc[id_servicio]) {
            acc[id_servicio] = {
                id_servicio,
                servicio_nombre,
                detalles: []
            };
        }

        // Add the detalle to the corresponding servicio
        acc[id_servicio].detalles.push(detalleTexto);

        return acc;
    }, {});

    // Convert the groupedServicios object to an array
    const serviciosArray = Object.values(groupedServicios);


    // Return the solicitud data along with grouped servicios and their detalles
    return { ...solicitud, servicios: serviciosArray };
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
const getServiceSolicitudesReport = async (req, res) => {
    try {
        // SQL query to generate the report
        const query = `
            SELECT 
                ds.id_servicio, 
                s.nombre AS servicio_nombre,
                COUNT(DISTINCT ds.id_solicitud) AS total_solicitudes
            FROM 
                detallesolicitud ds
            INNER JOIN 
                servicios s ON ds.id_servicio = s.id_servicio
            GROUP BY 
                ds.id_servicio, s.nombre
            ORDER BY 
                total_solicitudes DESC;
        `;

        // Execute the query
        const queryResult = await pool.query(query);

        // Extract rows from the query result
        const reportData = queryResult.rows;

        // Respond with the report data
        res.json(reportData);
    } catch (error) {
        console.error("Error generating service-solicitudes report:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
const getSolicitudesByTecnico = async (req, res) => {
    const { tecnicoId } = req.params;

    try {
        // Fetch solicitudes associated with the tecnico
        const query = `
            SELECT 
                s.*,
                c.datetime AS cita_datetime,
                u.nombre AS tecnico_nombre,
                u.apellido AS tecnico_apellido
            FROM 
                solicitud s
            INNER JOIN 
                cita c ON s.id_solicitud = c.id_solicitud
            INNER JOIN 
                usuario u ON c.id_tecnico = u.id_usuario
            WHERE 
                c.id_tecnico = $1
            ORDER BY 
                c.datetime ASC;
        `;

        // Execute the query with tecnicoId
        const queryResult = await pool.query(query, [tecnicoId]);

        // Respond with an empty array if no solicitudes are found
        if (queryResult.rows.length === 0) {
            return res.json([]); // Return an empty array
        }

        // Respond with the solicitudes and associated cita details
        res.json(queryResult.rows);
    } catch (error) {
        console.error("Error retrieving solicitudes by tecnico:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};




module.exports = {
    crearSolicitud_AgregarServicios,
    getAllSolicitudes,
    getSolicitudById,
    updateSolicitudEstado,
    updateSolicitudFechaPreferencia,
    getServiceSolicitudesReport,
    getSolicitudesByTecnico
};
