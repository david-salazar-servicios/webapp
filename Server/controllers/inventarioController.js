const socketManager = require('../socket');
const pool = require('../db');
const moment = require('moment-timezone');
const { logMovement } = require('./bitacoraController');

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
            return res.status(404).json({ message: "Inventario no encontrado." });
        }
        res.json(inventario.rows[0]);
    } catch (error) {
        console.error("Error retrieving inventario:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const createInventario = async (req, res) => {
    const client = await pool.connect();
    try {
        const { nombre_inventario } = req.body;
        await client.query('BEGIN');

        const newInventarioResult = await client.query(
            'INSERT INTO inventario (nombre_inventario) VALUES ($1) RETURNING *',
            [nombre_inventario]
        );
        const newInventario = newInventarioResult.rows[0];
        const newInventarioId = newInventario.id_inventario;

        const productosResult = await client.query('SELECT id_producto FROM producto');
        const productos = productosResult.rows;

        for (const producto of productos) {
            await client.query(
                'INSERT INTO inventario_producto (id_inventario, id_producto, cantidad, cantidad_recomendada) VALUES ($1, $2, $3, $4)',
                [newInventarioId, producto.id_producto, 0, 0]
            );
        }
        await client.query('COMMIT');
        res.json(newInventario);


    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error creating new inventario:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    } finally {
        client.release();
    }
};


const updateInventario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_inventario } = req.body;
        const updatedInventario = await pool.query(
            'UPDATE inventario SET nombre_inventario = $1 WHERE id_inventario = $2 RETURNING *',
            [nombre_inventario, id]
        );

        if (updatedInventario.rows.length === 0) {
            return res.status(404).json({ message: 'Inventario no encontrado.' });
        }
        res.json(updatedInventario.rows[0]);


    } catch (error) {
        console.error("Error updating Inventario:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const deleteInventario = async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        await client.query('BEGIN');

        const detalleProformaCheck = await client.query(
            'SELECT COUNT(*) FROM detalleproforma WHERE id_inventario = $1',
            [id]
        );
        const countInDetalleProforma = parseInt(detalleProformaCheck.rows[0].count, 10);

        if (countInDetalleProforma > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                message: 'No se puede eliminar el inventario porque está asociado a una Proforma registrado.'
            });
        }
        await client.query('DELETE FROM inventario_producto WHERE id_inventario = $1', [id]);
        await client.query('DELETE FROM inventario WHERE id_inventario = $1', [id]);
        await client.query('COMMIT');
        res.json({ message: 'Inventario eliminado con éxito' });


    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error deleting Inventario:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    } finally {
        client.release();
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
            SELECT p.*, ip.id_inventario, ip.cantidad, ip.cantidad_recomendada
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
                    precio_costo: producto.precio_costo,
                    precio_venta: producto.precio_venta,
                    unidad_medida: producto.unidad_medida,
                    imagen: producto.imagen,
                    cantidad: producto.cantidad, // Add cantidad from inventario_producto
                    cantidad_recomendada: producto.cantidad_recomendada // Add cantidad_recomendada from inventario_producto
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
    const { id_inventario, id_producto } = req.params;
    const { cantidad, action, destino_inventario } = req.body;

    try {
        if (!id_inventario || !id_producto) {
            return res.status(400).json({ message: 'Faltan parámetros requeridos: se requieren id_inventario e id_producto.' });
        }

        // Helper function to get inventory name by ID
        const getInventarioById = async (id) => {
            const result = await pool.query(`SELECT nombre_inventario FROM inventario WHERE id_inventario = $1`, [id]);
            return result.rows.length ? result.rows[0].nombre_inventario : null;
        };

        // Helper function to get product details by ID
        const getProductoById = async (id) => {
            const result = await pool.query(`SELECT codigo_producto, nombre_producto FROM producto WHERE id_producto = $1`, [id]);
            return result.rows.length ? result.rows[0] : null;
        };

        // Fetch details for the current inventory and product
        const nombre_inventario = await getInventarioById(id_inventario);
        const producto = await getProductoById(id_producto);

        if (!nombre_inventario || !producto) {
            return res.status(404).json({ message: 'Inventario o Producto no encontrado.' });
        }

        const { codigo_producto, nombre_producto } = producto;

        const currentQuantityResult = await pool.query(`
            SELECT cantidad FROM inventario_producto WHERE id_inventario = $1 AND id_producto = $2
        `, [id_inventario, id_producto]);

        if (!currentQuantityResult || currentQuantityResult.rows.length === 0) {
            return res.status(404).json({ message: 'Inventario o Producto no encontrado.' });
        }

        let newQuantity = parseFloat(currentQuantityResult.rows[0].cantidad);
        const incomingCantidad = parseFloat(cantidad);
        let updateSourceResult, description;

        switch (action) {
            case 'agregar':
                newQuantity += incomingCantidad;
                updateSourceResult = await pool.query(`
                    UPDATE inventario_producto SET cantidad = $1 WHERE id_inventario = $2 AND id_producto = $3 RETURNING *
                `, [newQuantity, id_inventario, id_producto]);
                description = `Producto ${codigo_producto} - ${nombre_producto} agregado al inventario ${nombre_inventario}: cantidad ${incomingCantidad}`;
                break;

            case 'eliminar':
                newQuantity = Math.max(0, newQuantity - incomingCantidad);
                updateSourceResult = await pool.query(`
                    UPDATE inventario_producto SET cantidad = $1 WHERE id_inventario = $2 AND id_producto = $3 RETURNING *
                `, [newQuantity, id_inventario, id_producto]);
                description = `Producto ${codigo_producto} - ${nombre_producto} eliminado del inventario ${nombre_inventario}: cantidad ${incomingCantidad}`;
                break;

            case 'mover':
                if (incomingCantidad > newQuantity) {
                    return res.status(400).json({ message: 'Cantidad insuficiente para mover.' });
                }
                newQuantity -= incomingCantidad;
                updateSourceResult = await pool.query(`
                    UPDATE inventario_producto
                    SET cantidad = $1
                    WHERE id_inventario = $2 AND id_producto = $3
                    RETURNING *
                `, [newQuantity, id_inventario, id_producto]);

                const updateDestinationResult = await pool.query(`
                    UPDATE inventario_producto
                    SET cantidad = cantidad + $1
                    WHERE id_inventario = $2 AND id_producto = $3
                    RETURNING *
                `, [incomingCantidad, destino_inventario, id_producto]);

                if (updateDestinationResult.rowCount === 0) {
                    return res.status(404).json({ message: 'Inventario de destino no encontrado.' });
                }

                const destino_inventario_nombre = await getInventarioById(destino_inventario);
                description = `Producto ${codigo_producto} - ${nombre_producto} movido del inventario ${nombre_inventario} al inventario ${destino_inventario_nombre}: cantidad ${incomingCantidad}`;
                
                // Respond with both the source and destination updates
                res.json({
                    source: updateSourceResult.rows[0],
                    destination: updateDestinationResult.rows[0]
                });
                
                // Log movement
                const currentUser = global.CURRENT_USER;
                await logMovement(currentUser, description,"Inventario");
                return;

            default:
                return res.status(400).json({ message: 'Acción especificada no válida.' });
        }

        // Return the result of the update for 'agregar' and 'eliminar' actions
        res.json(updateSourceResult.rows[0]);

        // Log the movement
        const currentUser = global.CURRENT_USER;
        await logMovement(currentUser, description,"Inventario");

    } catch (error) {
        console.error("Error al actualizar inventario_producto:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
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
