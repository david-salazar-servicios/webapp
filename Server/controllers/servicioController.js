// Asegúrate de que el archivo de conexión a la base de datos esté configurado correctamente.
const pool = require('../db');

// @desc Get all services
// @route GET /services
// @access Private
const getAllServicios = async (req, res) => {
    try {
        // Execute the SQL query to fetch all services
        const queryResult = await pool.query('SELECT * FROM Servicios');

        // Extract the service data from the query result
        const servicios = queryResult.rows; 

        // Return the list of services
        res.json(servicios);
    } catch (error) {
        console.error("Error retrieving services:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// @desc Create a new service
// @route POST /services
// @access Private
const createNewServicio = async (req, res) => {
    try {
        const { nombre, descripcion, id_categoria } = req.body;
        const newService = await pool.query(
            'INSERT INTO Servicios (nombre, descripcion, id_categoria) VALUES ($1, $2, $3) RETURNING *', 
            [nombre, descripcion, id_categoria]
        );

        res.json(newService.rows[0]);
    } catch (error) {
        console.error("Error creating new service:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// @desc Delete a service by ID
// @route DELETE /services/:id
// @access Private
const deleteServicio = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM Servicios WHERE id_servicio = $1', [id]);

        res.json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error("Error deleting service:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// @desc Get a single service by ID
// @route GET /services/:id
// @access Private
const getServicioById = async (req, res) => {
    try {
        const { id } = req.params;
        const resServicio = await pool.query('SELECT * FROM Servicios WHERE id_servicio = $1', [id]);

        if (resServicio.rows.length === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }

        const imgurResponse = await fetch(`https://api.imgur.com/3/album/${resServicio.rows[0].album}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Client-ID ${process.env.CLIENT_ID}`,
            }
        });

        // Parse the response as JSON
        const imgurData = await imgurResponse.json();
        

        // Check if the response contains images
        if (!imgurData.success) {
            throw new Error('Failed to fetch images from Imgur');
        }

        const offerResponse = await fetch(resServicio.rows[0].id_ofrecemos, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            }
        });

        // Parse the response as JSON
        const offerData = await offerResponse.json();
        
        // Check if the response contains images
        if (!imgurData.success) {
            throw new Error('Failed to fetch images from Imgur');
        }

        // Extract images from the Imgur response
        const imgurImages = imgurData.data;
        const servicio = resServicio.rows[0];
        res.json({servicio,
            offerData,
            imgurImages
        });
       


    

    } catch (error) {
        console.error("Error retrieving service:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// @desc Update a service by ID
// @route PUT /services/:id
// @access Private
const updateServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, id_categoria } = req.body;
        const updatedService = await pool.query(
            'UPDATE Servicios SET nombre = $1, descripcion = $2, id_categoria = $3 WHERE id_servicio = $4 RETURNING *',
            [nombre, descripcion, id_categoria, id]
        );

        if (updatedService.rows.length === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json(updatedService.rows[0]);
    } catch (error) {
        console.error("Error updating service:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
// @desc Add a service to a user
// @route POST /usuarios_servicios
// @access Private
const addUsuarioServicio = async (req, res) => {
    try {
        const { id_usuario, id_servicio } = req.body;
        

        // Verifica que ambos IDs estén presentes
        if (!id_usuario || !id_servicio) {
            return res.status(400).json({ message: 'Missing id_usuario or id_servicio' });
        }

        const newUsuarioServicio = await pool.query(
            'INSERT INTO usuarios_servicios (id_usuario, id_servicio) VALUES ($1, $2) RETURNING *', 
            [id_usuario, id_servicio]
        );

        // Si todo sale bien, devuelve el nuevo registro
        res.json(newUsuarioServicio.rows[0]);
    } catch (error) {
        console.error("Error adding service to user:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const getUsuarioServicioById = async (req, res) => {
    try {
   
        const { id } = req.params;
        const service = await pool.query('SELECT * FROM usuarios_servicios WHERE id_usuario = $1', [id]);

        if (service.rows.length === 0) {
            return res.json(null);
        }

        res.json(service.rows);
    } catch (error) {
        console.error("Error retrieving service:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const deleteUsuarioServicioById = async (req, res) => {
    try {
        // Extrayendo de req.params en lugar de req.body
        const { id_servicio,id_usuario  } = req.params;


        const result = await pool.query(
            'DELETE FROM usuarios_servicios WHERE id_usuario = $1 AND id_servicio = $2 RETURNING *',
            [id_usuario, id_servicio]
        );
        
        // Si no se eliminó ninguna fila, significa que el servicio no se encontró
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Responde con los detalles del servicio eliminado
        res.json({ message: 'Service deleted successfully', deletedService: result.rows[0] });
    } catch (error) {
        console.error("Error deleting service:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const deleteAllUsuarioServicio = async (req, res) => {
    try {
        // Extrayendo de req.params en lugar de req.body
        const {id_usuario} = req.params;


        const result = await pool.query(
            'DELETE FROM usuarios_servicios WHERE id_usuario = $1 RETURNING *',
            [id_usuario]
        );
        
        // Si no se eliminó ninguna fila, significa que el servicio no se encontró
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Responde con los detalles del servicio eliminado
        res.json({ message: 'Service deleted successfully', deletedService: result.rows[0] });
    } catch (error) {
        console.error("Error deleting service:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


const getDetalleServiciosByIds = async (req, res) => {
    try {
        const { ids } = req.body; // Asume que el arreglo de IDs viene en el cuerpo de la petición bajo la clave "ids"

        // Verificar si el arreglo de IDs está presente y no está vacío
        if (!ids || ids.length === 0) {
            return res.status(400).json({ message: 'No IDs provided' });
        }

        // Crear la cadena para la consulta SQL utilizando ANY para que se puedan buscar múltiples IDs a la vez
        const queryResult = await pool.query(
            'SELECT * FROM Servicios WHERE id_servicio = ANY($1)',
            [ids] // Postgres espera que el parámetro para ANY sea un array
        );

        // Si no se encuentran servicios, devuelve un estado 404
        if (queryResult.rows.length === 0) {
            return res.status(404).json({ message: 'Services not found' });
        }

        // Retorna los servicios encontrados
        res.json(queryResult.rows);
    } catch (error) {
        console.error("Error retrieving services by IDs:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }

    
};




module.exports = {
    getAllServicios,
    createNewServicio,
    deleteServicio,
    getServicioById,
    updateServicio,
    addUsuarioServicio,
    getUsuarioServicioById,
    getDetalleServiciosByIds,
    deleteUsuarioServicioById,
    deleteAllUsuarioServicio
};
