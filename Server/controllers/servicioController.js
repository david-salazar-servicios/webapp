// Asegúrate de que el archivo de conexión a la base de datos esté configurado correctamente.
const pool = require('../db');
const fetch = require('node-fetch'); // Importar node-fetch
// @desc Get all services
// @route GET /services
// @access Private
const getAllServicios = async (req, res) => {
    try {
        // Ejecutar las consultas SQL para obtener servicios y categorías
        const queryResult = await pool.query('SELECT * FROM Servicios');
        const queryIdServiceCategoria = await pool.query('SELECT * FROM servicio_categoria');

        // Obtener servicios y categorías de las consultas
        const servicios = queryResult.rows;
        const categorias = queryIdServiceCategoria.rows;

        // Crear una lista separada para las ofertas
        const offers = await Promise.all(
            servicios.map(async (servicio) => {
                try {
                    const offerResponse = await fetch(servicio.id_ofrecemos, {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                        },
                    });

                    const offerData = await offerResponse.json();

                    // Agregar la oferta a la lista de ofertas
                    return {
                        id_servicio: servicio.id_servicio,
                        offerData, // Incluye los datos obtenidos
                    };
                } catch (error) {
                    console.error(`Error fetching offers for service ${servicio.id_servicio}:`, error);
                    // Si ocurre un error, agrega una entrada con un indicador de error
                    return {
                        id_servicio: servicio.id_servicio,
                        offerData: null,
                    };
                }
            })
        );

        // Construir la lista final
        const finalServiceList = {
            servicios,  // Lista de servicios
            categorias, // Lista de categorías
            offers,     // Lista separada de ofertas
        };

        // Enviar la respuesta final
        res.json(finalServiceList);
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
        const { nombre, descripcion, categoria } = req.body; // categoria is now an array

        // Insert the new service into the Servicios table
        const newService = await pool.query(
            'INSERT INTO Servicios (nombre, descripcion) VALUES ($1, $2) RETURNING *', 
            [nombre, descripcion]
        );

        const serviceId = newService.rows[0].id_servicio; // Get the ID of the newly created service

        // Insert the service-category relationships into the servicio_categoria table
        for (const catId of categoria) {
            await pool.query(
                'INSERT INTO servicio_categoria (id_servicio, id_categoria) VALUES ($1, $2)',
                [serviceId, catId]
            );
        }

        res.json({ message: 'Service created successfully', service: newService.rows[0] });
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
        await pool.query('DELETE FROM servicio_categoria WHERE id_servicio = $1', [id]);
        await pool.query('DELETE FROM Servicios WHERE id_servicio = $1', [id]);

        res.json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error("Error deleting service:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const getAlbums = async (req, res) => {
    try {
       const servicios = req.body;
        // Validate that servicios is an array and not empty
        if (!Array.isArray(servicios) || servicios.length === 0) {
            return res.status(400).json({ message: 'Invalid servicios array' });
        }
       

        const albumPromises = servicios.map(async (servicio) => {
            if (!servicio.album) {
                return null; // Skip if album is not defined
            }
            const albumRes = await fetch(`https://api.imgur.com/3/album/${servicio.album}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Client-ID ${process.env.CLIENT_ID}`,
                }
            });

            const album = await albumRes.json();

            if (!album.success) {
                throw new Error(`Failed to fetch images from Imgur for album ${servicio.album}`);
            }
            return album;
        });

        const albums = (await Promise.all(albumPromises)).filter(album => album !== null);
        res.json(albums);
    } catch (error) {
        console.error("Error retrieving albums:", error);
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
        const list_category = await pool.query('SELECT Categoria.id_categoria, Categoria.nombre FROM Categoria JOIN servicio_categoria ON ' +
            'servicio_categoria.id_categoria = categoria.id_categoria ' +
            'JOIN Servicios ON servicio_categoria.id_servicio = servicios.id_servicio ' +
            'WHERE servicios.id_servicio = $1', [id]);
        

        
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
        if (!offerData.status === 200) {
            throw new Error('Failed to fetch offer data');
        }

        const servicioObject =({
            ...resServicio.rows[0],
            categorias:list_category.rows,
            imagenes:imgurData.data.images,
            offers:offerData
        })

            res.json(servicioObject);
           
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
        const { id } = req.params; // Service ID from the URL
        const { nombre, descripcion, categoria } = req.body; // Name, description, and categories from the request body

        // Update the service details in the Servicios table
        const updatedService = await pool.query(
            'UPDATE Servicios SET nombre = $1, descripcion = $2 WHERE id_servicio = $3 RETURNING *',
            [nombre, descripcion, id]
        );

        if (updatedService.rows.length === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Remove existing relations from servicio_categoria where id_servicio matches the service
        await pool.query(
            'DELETE FROM servicio_categoria WHERE id_servicio = $1',
            [id]
        );

        // Insert new relations into servicio_categoria using the new categoria array
        for (const catId of categoria) {
            await pool.query(
                'INSERT INTO servicio_categoria (id_servicio, id_categoria) VALUES ($1, $2)',
                [id, catId]
            );
        }

        res.json({ message: 'Service updated successfully', service: updatedService.rows[0] });
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
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
    deleteAllUsuarioServicio,
    getAlbums
};
