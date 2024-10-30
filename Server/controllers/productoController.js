const socketManager = require('../socket'); // Adjust the path as necessary
const pool = require('../db');
const moment = require('moment-timezone');

const getAllProductos = async (req, res) => {
    try {
        const queryResult = await pool.query('SELECT * FROM producto');
        const productos = queryResult.rows;
        res.json(productos);
    } catch (error) {
        console.error("Error retrieving productos:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const getProductoById = async (req, res) => {
    const { id } = req.params;

    try {
        const producto = await pool.query('SELECT * FROM producto WHERE id_producto = $1', [id]);
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
    const client = await pool.connect();

    try {
        const { codigo_producto, nombre_producto, unidad_medida, imagen, precio_costo, precio_venta } = req.body;

        await client.query('BEGIN');

        const newProductoResult = await client.query(
            `INSERT INTO producto (codigo_producto, nombre_producto, unidad_medida, imagen, precio_costo, precio_venta) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [codigo_producto, nombre_producto, unidad_medida, imagen, precio_costo, precio_venta]
        );

        const newProducto = newProductoResult.rows[0];
        const newProductoId = newProducto.id_producto;

        const inventariosResult = await client.query('SELECT id_inventario FROM inventario');
        const inventarios = inventariosResult.rows;

        for (const inventario of inventarios) {
            await client.query(
                'INSERT INTO inventario_producto (id_inventario, id_producto, cantidad) VALUES ($1, $2, $3)',
                [inventario.id_inventario, newProductoId, 0]
            );
        }

        await client.query('COMMIT');
        res.json(newProducto);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error creating new producto:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    } finally {
        client.release();
    }
};

const updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { codigo_producto, nombre_producto, unidad_medida, imagen, precio_costo, precio_venta } = req.body;

        const updatedProducto = await pool.query(
            `UPDATE producto 
            SET codigo_producto = $1, nombre_producto = $2, unidad_medida = $3, imagen = $4, 
                precio_costo = $5, precio_venta = $6 
            WHERE id_producto = $7 RETURNING *`,
            [codigo_producto, nombre_producto, unidad_medida, imagen, precio_costo, precio_venta, id]
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
    const client = await pool.connect();

    try {
        const { id } = req.params;

        await client.query('BEGIN');

        const detalleProformaResult = await client.query(
            'SELECT COUNT(*) FROM detalleproforma WHERE id_producto = $1',
            [id]
        );

        const countInDetalleProforma = parseInt(detalleProformaResult.rows[0].count, 10);

        if (countInDetalleProforma > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Producto is associated with a registered detalleproforma and cannot be deleted.' });
        }

        const cantidadCheckResult = await client.query(
            'SELECT COUNT(*) FROM inventario_producto WHERE id_producto = $1 AND cantidad > 0',
            [id]
        );

        const countWithPositiveCantidad = parseInt(cantidadCheckResult.rows[0].count, 10);

        if (countWithPositiveCantidad > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Producto has non-zero cantidad in one or more inventories and cannot be deleted.' });
        }

        await client.query('DELETE FROM inventario_producto WHERE id_producto = $1', [id]);
        await client.query('DELETE FROM producto WHERE id_producto = $1', [id]);

        await client.query('COMMIT');
        res.json({ message: 'Producto deleted successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error deleting Producto:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    } finally {
        client.release();
    }
};

module.exports = {
    getAllProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto,
};
