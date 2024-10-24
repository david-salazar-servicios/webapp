
// solicitudController.js
const socketManager = require('../socket'); // Adjust the path as necessary
const pool = require('../db');
// solicitudController.js
const moment = require('moment-timezone');

const getAllProductos = async (req, res) => {
    
    try {
        // Execute the SQL query to fetch all services
        const queryResult = await pool.query('SELECT * FROM producto');

        // Extract the service data from the query result
        const productos = queryResult.rows; 

        // Return the list of services
        res.json(productos);
    } catch (error) {
        console.error("Error retrieving productos:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const getProductoById = async (req, res) => {
    const { id } = req.params;
    
    // Validate that the ID is an integer
    const productoId = id;

    try {
        const producto = await pool.query('SELECT * FROM producto WHERE id_producto = $1', [productoId]);
        if (producto.rows.length === 0) {
            return res.status(404).json({ message: "Producto not found." });
        }
        res.json(producto.rows[0]);
    } catch (error) {
        console.error("Error retrieving producto:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const createProducto = async (req, res) => {
    const client = await pool.connect(); // Use a transaction for multiple queries
    
    try {
        const { codigo_producto, nombre_producto, unidad_medida, imagen } = req.body;

        await client.query('BEGIN'); // Begin the transaction

        // Insert the new product into the producto table
        const newProductoResult = await client.query(
            'INSERT INTO producto (codigo_producto, nombre_producto, unidad_medida, imagen) VALUES ($1, $2, $3, $4) RETURNING *',
            [codigo_producto, nombre_producto, unidad_medida, imagen]
        );
        const newProducto = newProductoResult.rows[0];
        const newProductoId = newProducto.id_producto; // Get the newly created product's ID

        // Fetch all existing inventories
        const inventariosResult = await client.query('SELECT id_inventario FROM inventario');
        const inventarios = inventariosResult.rows;

        // Insert the new product into each inventario with cantidad = 0
        for (const inventario of inventarios) {
            await client.query(
                'INSERT INTO inventario_producto (id_inventario, id_producto, cantidad) VALUES ($1, $2, $3)',
                [inventario.id_inventario, newProductoId, 0] // Set cantidad to 0
            );
        }

        await client.query('COMMIT'); // Commit the transaction

        res.json(newProducto); // Return the newly created product
    } catch (error) {
        await client.query('ROLLBACK'); // Roll back the transaction in case of error
        console.error("Error creating new producto:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    } finally {
        client.release(); // Release the client back to the pool
    }
};


const updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { codigo_producto , nombre_producto,unidad_medida,imagen } = req.body;
        const updatedProducto = await pool.query(
            'UPDATE producto SET codigo_producto = $1, nombre_producto = $2, unidad_medida = $3 , imagen = $4  WHERE id_producto = $5 RETURNING *',
            [codigo_producto, nombre_producto, unidad_medida,imagen,id]
        );

        if (updatedProducto.rows.length === 0) {
            return res.status(404).json({ message: 'Producto not found' });
        }

        res.json(updatedProducto.rows[0]);
    } catch (error) {
        console.error("Error updating Producto:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const deleteProducto = async (req, res) => {
    const client = await pool.connect(); // Use a transaction for multiple queries

    try {
        const { id } = req.params;

        await client.query('BEGIN'); // Begin the transaction

        // Check if the product is associated with any detalleproforma
        const detalleProformaResult = await client.query(
            'SELECT COUNT(*) FROM detalleproforma WHERE id_producto = $1',
            [id]
        );

        const countInDetalleProforma = parseInt(detalleProformaResult.rows[0].count, 10);

        if (countInDetalleProforma > 0) {
            await client.query('ROLLBACK'); // Rollback the transaction if the product is associated
            return res.status(400).json({ message: 'Producto is associated with a registered detalleproforma and cannot be deleted.' });
        }

        // Check if the product's cantidad is 0 in all inventories
        const cantidadCheckResult = await client.query(
            'SELECT COUNT(*) FROM inventario_producto WHERE id_producto = $1 AND cantidad > 0',
            [id]
        );

        const countWithPositiveCantidad = parseInt(cantidadCheckResult.rows[0].count, 10);

        if (countWithPositiveCantidad > 0) {
            await client.query('ROLLBACK'); // Rollback the transaction if any cantidad is greater than 0
            return res.status(400).json({ message: 'Producto has non-zero cantidad in one or more inventories and cannot be deleted.' });
        }

        // If no associations in detalleproforma and all cantidades are 0, proceed with deletion
        // Delete from inventario_producto
        await client.query('DELETE FROM inventario_producto WHERE id_producto = $1', [id]);

        // Delete the product from the producto table
        await client.query('DELETE FROM producto WHERE id_producto = $1', [id]);

        await client.query('COMMIT'); // Commit the transaction

        res.json({ message: 'Producto deleted successfully' });
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback the transaction in case of error
        console.error("Error deleting Producto:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    } finally {
        client.release(); // Release the client back to the pool
    }
};





module.exports = {
    getAllProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto,
};
