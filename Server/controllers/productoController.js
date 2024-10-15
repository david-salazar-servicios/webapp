
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
    try {
        const { codigo_producto , nombre_producto,unidad_medida,imagen } = req.body;
        const newProducto = await pool.query(
            'INSERT INTO producto (codigo_producto, nombre_producto,unidad_medida,imagen) VALUES ($1, $2, $3, $4) RETURNING *', 
            [codigo_producto, nombre_producto, unidad_medida,imagen]
        );

        res.json(newProducto.rows[0]);
    } catch (error) {
        console.error("Error creating new producto:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
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
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM producto WHERE id_producto = $1', [id]);

        res.json({ message: 'Producto deleted successfully' });
    } catch (error) {
        console.error("Error deleting Producto:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};




module.exports = {
    getAllProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto,
};
