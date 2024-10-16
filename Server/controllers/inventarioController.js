
// solicitudController.js
const socketManager = require('../socket'); // Adjust the path as necessary
const pool = require('../db');
// solicitudController.js
const moment = require('moment-timezone');

const getAllInventarios = async (req, res) => {
    
    try {
        // Execute the SQL query to fetch all services
        const queryResult = await pool.query('SELECT * FROM inventario');

        // Extract the service data from the query result
        const inventarios = queryResult.rows; 

        // Return the list of services
        res.json(inventarios);
    } catch (error) {
        console.error("Error retrieving inventarios:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


const getInventarioById = async (req, res) => {
    const { id } = req.params;
    
    // Validate that the ID is an integer
    const inventarioId = id;

    try {
        const inventario = await pool.query('SELECT * FROM inventario WHERE id_inventario = $1', [inventarioId]);
        if (inventario.rows.length === 0) {
            return res.status(404).json({ message: "Inventario not found." });
        }
        res.json(inventario.rows[0]);
    } catch (error) {
        console.error("Error retrieving inventario:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const createInventario = async (req, res) => {
    try {
        const { nombre_inventario} = req.body;
        const newInventario = await pool.query(
            'INSERT INTO inventario (nombre_inventario) VALUES ($1) RETURNING *', 
            [nombre_inventario]
        );

        res.json(newInventario.rows[0]);
    } catch (error) {
        console.error("Error creating new inventario:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const updateInventario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_inventario} = req.body;
        const updatedInventario = await pool.query(
            'UPDATE inventario SET nombre_inventario = $1 WHERE id_inventario = $2 RETURNING *',
            [nombre_inventario, id]
        );

        if (updatedInventario.rows.length === 0) {
            return res.status(404).json({ message: 'Inventario not found' });
        }

        res.json(updatedInventario.rows[0]);
    } catch (error) {
        console.error("Error updating Inventario:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const deleteInventario = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM inventario WHERE id_inventario = $1', [id]);

        res.json({ message: 'Inventario deleted successfully' });
    } catch (error) {
        console.error("Error deleting Inventario:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


////////// TABLA INTERMEDIA inventario_producto //////////

const getAllInventariosProductos = async (req, res) => {
    try {
        // First, fetch all inventarios
        const inventariosResult = await pool.query('SELECT * FROM inventario');
        const inventarios = inventariosResult.rows;

        // If no inventarios found, return an empty array
        if (inventarios.length === 0) {
            return res.json([]);
        }

        // Now, fetch all productos with their associated inventarios and cantidad
        const productosResult = await pool.query(`
            SELECT p.*, ip.id_inventario, ip.cantidad
            FROM producto p
            INNER JOIN inventario_producto ip ON p.id_producto = ip.id_producto
        `);

        const productos = productosResult.rows;

        // Structure the response: Add products and cantidad to their corresponding inventarios
        const inventariosWithProductos = inventarios.map(inventario => {
            // Find all productos for the current inventario with cantidad
            const productosForInventario = productos
                .filter(producto => producto.id_inventario === inventario.id_inventario)
                .map(producto => ({
                    id_producto: producto.id_producto,
                    codigo_producto: producto.codigo_producto,
                    nombre_producto: producto.nombre_producto,
                    unidad_medida: producto.unidad_medida,
                    imagen: producto.imagen,
                    cantidad: producto.cantidad // Add cantidad from inventario_producto
                }));

            return {
                ...inventario,
                productos: productosForInventario
            };
        });

        // Return the list of inventarios with their productos and cantidades
        res.json(inventariosWithProductos);
    } catch (error) {
        console.error("Error retrieving inventarios with productos:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


const updateCantidadInventarioProducto = async (req, res) => {
    const { id_inventario, id_producto } = req.params; // Get inventario and producto IDs from the URL params
    const { cantidad } = req.body; // Get the new cantidad from the request body

    try {
        // Validate that the IDs and cantidad are provided and valid
        if (!id_inventario || !id_producto || cantidad == null) {
            return res.status(400).json({ message: 'Missing required parameters: id_inventario, id_producto, and cantidad are required.' });
        }

        // Update the cantidad for the specific product in the specific inventario
        const updateResult = await pool.query(`
            UPDATE inventario_producto
            SET cantidad = $1
            WHERE id_inventario = $2 AND id_producto = $3
            RETURNING *
        `, [cantidad, id_inventario, id_producto]);

        // If no rows were updated, return a 404 error
        if (updateResult.rowCount === 0) {
            return res.status(404).json({ message: 'Inventario or Producto not found or no changes made.' });
        }

        // Return the updated row
        res.json(updateResult.rows[0]);
    } catch (error) {
        console.error("Error updating cantidad:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


module.exports = {
    getAllInventarios,
    getAllInventariosProductos,
    updateCantidadInventarioProducto,
    getInventarioById,
    createInventario,
    updateInventario,
    deleteInventario,
};
