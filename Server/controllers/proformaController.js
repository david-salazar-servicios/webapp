const pool = require('../db');
const { updateCantidadInventarioProducto } = require('./inventarioController');


// @desc Get all Proformas with full details
// @route GET /proforma
// @access Private
const getAllProformas = async (req, res) => {
    try {
        // Fetch all proformas with client details (cliente)
        const proformasQuery = `
            SELECT 
                p.*, 
                CONCAT(s.nombre, ' ', s.apellido) AS cliente, 
                CONCAT(u.nombre, ' ', u.apellido) AS tecnico
            FROM proforma p
            LEFT JOIN solicitud s ON p.id_solicitud = s.id_solicitud
            LEFT JOIN cita c ON p.id_solicitud = c.id_solicitud
            LEFT JOIN usuario u ON c.id_tecnico = u.id_usuario;
        `;
        const proformasResult = await pool.query(proformasQuery);
        const proformas = proformasResult.rows;

        // If no proformas found, return an empty array
        if (proformas.length === 0) {
            return res.json({ proformas: [] });
        }

        // Fetch all related details for each proforma
        const proformaDetails = await Promise.all(
            proformas.map(async (proforma) => {
                // Fetch productos from `detalleproforma`
                const productosQuery = `
                    SELECT * FROM detalleproforma WHERE id_proforma = $1;
                `;
                const productosResult = await pool.query(productosQuery, [proforma.id_proforma]);
                const productos = [];
                const productosAdicionales = [];

                // Separate productos and productosAdicionales
                for (const producto of productosResult.rows) {
                    if (producto.id_producto && producto.id_inventario) {
                        productos.push(producto);
                    } else {
                        productosAdicionales.push(producto);
                    }
                }

                // Fetch servicios from `servicios_proforma`
                const serviciosQuery = `
                    SELECT * FROM servicios_proforma WHERE id_proforma = $1;
                `;
                const serviciosResult = await pool.query(serviciosQuery, [proforma.id_proforma]);
                const servicios = [];
                const serviciosAdicionales = [];

                // Separate servicios and serviciosAdicionales
                for (const servicio of serviciosResult.rows) {
                    if (servicio.id_servicio) {
                        servicios.push(servicio);
                    } else {
                        serviciosAdicionales.push(servicio);
                    }
                }

                return {
                    ...proforma,
                    productos,
                    productosAdicionales,
                    servicios,
                    serviciosAdicionales,
                };
            })
        );

        res.json(proformaDetails);
    } catch (error) {
        console.error('Error retrieving all proformas:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};





// @desc Create a new Proforma
// @route POST /proforma
// @access Private
const createProforma = async (req, res) => {
    const client = await pool.connect(); // Begin a transaction
    try {
        const {
            solicitud,
            archivoInfo,
            servicios,
            serviciosAdicionales,
            productos,
            productosAdicionales,
            totales,
            notas,
            fecha,
            sinIVA,
            sinDetalle,
        } = req.body;


        const formattedDate = fecha.split('-').reverse().join('-'); // Convert "DD-MM-YYYY" to "YYYY-MM-DD"


        await client.query('BEGIN'); // Start transaction

        // Insert into `proforma`
        const proformaQuery = `
            INSERT INTO proforma (
                id_solicitud, 
                fechacreacion, 
                notas, 
                subtotal, 
                totaliva, 
                total, 
                estado, 
                numeroarchivo, 
                numerocotizacion, 
                nc_fe, 
                oferta_valida,
                sinIVA,
                ultima_modificacion
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id_proforma;
        `;
        const proformaValues = [
            solicitud.solicitudId,
            formattedDate,
            notas,
            totales.subtotal,
            totales.iva,
            totales.total,
            'En Progreso', // Default status
            archivoInfo.numeroArchivo,
            archivoInfo.cotizacion,
            archivoInfo.ncFe,
            archivoInfo.ofertaValida,
            sinIVA,
            formattedDate,
        ];
        const proformaResult = await client.query(proformaQuery, proformaValues);
        const id_proforma = proformaResult.rows[0].id_proforma;

        // Insert into `detalleproforma`
        for (const product of productos) {
            const detalleProformaQuery = `
                INSERT INTO detalleproforma (
                    id_proforma, 
                    id_producto,
                    codigo_producto, 
                    descripcion,
                    id_inventario,
                    inventario_nombre, 
                    cantidad,
                    unidad_medida, 
                    precio, 
                    excedente, 
                    iva,
                    total
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
            `;
            const detalleProformaValues = [
                id_proforma,
                product.productoId, 
                product.codigo_producto,
                product.descripcion,
                product.inventarioId,
                product.inventario_nombre,
                product.cantidad,
                product.unidad_medida,
                product.precio_venta,
                product.excedente,
                product.iva,
                product.total,
            ];
            await client.query(detalleProformaQuery, detalleProformaValues);
        }

        // Insert into `detalleproforma` for additional products
        for (const product of productosAdicionales) {
            const detalleAdicionalQuery = `
                INSERT INTO detalleproforma (
                    id_proforma, 
                    descripcion,
                    precio, 
                    excedente, 
                    iva,
                    total
                ) VALUES ($1, $2, $3, $4, $5, $6);
            `;
            const detalleAdicionalValues = [
                id_proforma,
                product.descripcion,
                product.precio_venta,
                product.excedente,
                product.iva,
                product.total,
            ];
            await client.query(detalleAdicionalQuery, detalleAdicionalValues);
        }

        // Insert into `servicios_proforma`
        for (const servicio of servicios) {
            for (const detalle of servicio.detalles) {
                const serviciosProformaQuery = `
                    INSERT INTO servicios_proforma (
                        id_proforma, 
                        id_servicio, 
                        detalle
                    ) VALUES ($1, $2, $3);
                `;
                const serviciosProformaValues = [id_proforma, servicio.id_servicio, detalle];
                await client.query(serviciosProformaQuery, serviciosProformaValues);
            }
        }

        // Insert `serviciosAdicionales` into `servicios_proforma`
        for (const adicional of serviciosAdicionales) {
            const serviciosAdicionalesQuery = `
                INSERT INTO servicios_proforma (
                    id_proforma, 
                    id_servicio, 
                    detalle
                ) VALUES ($1, NULL, $2);
            `;
            const serviciosAdicionalesValues = [id_proforma, adicional];
            await client.query(serviciosAdicionalesQuery, serviciosAdicionalesValues);
        }

        await client.query('COMMIT'); // Commit transaction
        res.status(201).json({ message: 'Proforma created successfully', id_proforma });
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        console.error('Error creating proforma:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    } finally {
        client.release();
    }
};



// @desc Get a Proforma by ID with full details
// @route GET /proforma/:id
// @access Private
const getProformaById = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch proforma
        const proformaQuery = `
            SELECT * FROM proforma WHERE id_proforma = $1;
        `;
        const proformaResult = await pool.query(proformaQuery, [id]);
        if (proformaResult.rows.length === 0) {
            return res.status(404).json({ message: 'Proforma not found' });
        }
        const proforma = proformaResult.rows[0];

        // Fetch productos from `detalleproforma`
        const productosQuery = `
            SELECT * FROM detalleproforma WHERE id_proforma = $1;
        `;
        const productosResult = await pool.query(productosQuery, [id]);
        const productos = [];
        const productosAdicionales = [];

        // Separate productos and productosAdicionales
        for (const producto of productosResult.rows) {
            if (producto.id_producto && producto.id_inventario) {
                productos.push(producto);
            } else {
                productosAdicionales.push(producto);
            }
        }

        // Fetch servicios from `servicios_proforma`
        const serviciosQuery = `
            SELECT * FROM servicios_proforma WHERE id_proforma = $1;
        `;
        const serviciosResult = await pool.query(serviciosQuery, [id]);
        const servicios = [];
        const serviciosAdicionales = [];

        // Separate servicios and serviciosAdicionales
        for (const servicio of serviciosResult.rows) {
            if (servicio.id_servicio) {
                servicios.push(servicio);
            } else {
                serviciosAdicionales.push(servicio);
            }
        }

        res.json({
            proforma,
            productos,
            productosAdicionales,
            servicios,
            serviciosAdicionales,
        });
    } catch (error) {
        console.error('Error retrieving proforma:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};




// @desc Get a Proforma by NumeroArchivo with full details
// @route GET /proforma/numeroarchivo/:numeroArchivo
// @access Private
const getProformaByNumeroArchivo = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch proforma by numeroArchivo
        const proformaQuery = `
            SELECT * FROM proforma WHERE numeroarchivo = $1;
        `;
        const proformaResult = await pool.query(proformaQuery, [id]);
        if (proformaResult.rows.length === 0) {
            return res.status(404).json({ message: 'Proforma not found' });
        }
        const proforma = proformaResult.rows[0];

        // Fetch productos from `detalleproforma`
        const productosQuery = `
            SELECT * FROM detalleproforma WHERE id_proforma = $1;
        `;
        const productosResult = await pool.query(productosQuery, [proforma.id_proforma]);
        const productos = [];
        const productosAdicionales = [];

        // Separate productos and productosAdicionales
        for (const producto of productosResult.rows) {
            if (producto.id_producto && producto.id_inventario) {
                productos.push(producto);
            } else {
                productosAdicionales.push(producto);
            }
        }

        // Fetch servicios from `servicios_proforma`
        const serviciosQuery = `
            SELECT * FROM servicios_proforma WHERE id_proforma = $1;
        `;
        const serviciosResult = await pool.query(serviciosQuery, [proforma.id_proforma]);
        const servicios = [];
        const serviciosAdicionales = [];

        // Separate servicios and serviciosAdicionales
        for (const servicio of serviciosResult.rows) {
            if (servicio.id_servicio) {
                servicios.push(servicio);
            } else {
                serviciosAdicionales.push(servicio);
            }
        }

        res.json({
            proforma,
            productos,
            productosAdicionales,
            servicios,
            serviciosAdicionales,
        });
    } catch (error) {
        console.error('Error retrieving proforma by NumeroArchivo:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};



// @desc Delete a Proforma by ID
// @route DELETE /proforma/:id
// @access Private
const deleteProforma = async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;

        await client.query('BEGIN'); // Start transaction

        // Delete from `detalleproforma`
        await client.query('DELETE FROM detalleproforma WHERE id_proforma = $1', [id]);

        // Delete from `servicios_proforma`
        await client.query('DELETE FROM servicios_proforma WHERE id_proforma = $1', [id]);

        // Delete from `proforma`
        await client.query('DELETE FROM proforma WHERE id_proforma = $1', [id]);

        await client.query('COMMIT'); // Commit transaction
        res.json({ message: 'Proforma deleted successfully' });
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        console.error('Error deleting proforma:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    } finally {
        client.release();
    }
};

// @desc Update a Proforma by ID
// @route PUT /proforma/:id
// @access Private
const updateProforma = async (req, res) => {
    const client = await pool.connect(); // Begin a transaction
    try {
        const { id } = req.params; // ID of the proforma to update
        const {
            solicitud,
            archivoInfo,
            servicios,
            serviciosAdicionales,
            productos,
            productosAdicionales,
            totales,
            notas,
            sinIVA,
            sinDetalle,
        } = req.body;

       

        await client.query('BEGIN'); // Start transaction

        // Update the `proforma` table
        const proformaUpdateQuery = `
            UPDATE proforma
            SET 
                id_solicitud = $1,
                ultima_modificacion = CURRENT_TIMESTAMP,
                notas = $2,
                subtotal = $3,
                totaliva = $4,
                total = $5,
                estado = $6,
                numeroarchivo = $7,
                numerocotizacion = $8,
                nc_fe = $9,
                oferta_valida = $10,
                sinIVA = $11
            WHERE id_proforma = $12;
        `;
        const proformaUpdateValues = [
            solicitud.solicitudId,
            notas,
            totales.subtotal,
            totales.iva,
            totales.total,
            'En Progreso', // Default status
            archivoInfo.numeroArchivo,
            archivoInfo.cotizacion,
            archivoInfo.ncFe,
            archivoInfo.ofertaValida,
            sinIVA,
            id,
        ];
        await client.query(proformaUpdateQuery, proformaUpdateValues);

        // Clear existing `detalleproforma` entries for this proforma
        await client.query('DELETE FROM detalleproforma WHERE id_proforma = $1', [id]);

        // Re-insert new `detalleproforma` entries
        for (const product of productos) {
            const detalleProformaQuery = `
                INSERT INTO detalleproforma (
                    id_proforma, 
                    id_producto,
                    codigo_producto, 
                    descripcion,
                    id_inventario,
                    inventario_nombre, 
                    cantidad,
                    unidad_medida, 
                    precio, 
                    excedente, 
                    iva,
                    total
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
            `;
            const detalleProformaValues = [
                id,
                product.productoId,
                product.codigo_producto,
                product.descripcion,
                product.inventarioId,
                product.inventario_nombre,
                product.cantidad,
                product.unidad_medida,
                product.precio_venta,
                product.excedente,
                product.iva,
                product.total,
            ];
            await client.query(detalleProformaQuery, detalleProformaValues);
        }

        // Insert new `detalleproforma` entries for additional products
        for (const product of productosAdicionales) {
            const detalleAdicionalQuery = `
                INSERT INTO detalleproforma (
                    id_proforma, 
                    descripcion,
                    precio, 
                    excedente, 
                    iva,
                    total
                ) VALUES ($1, $2, $3, $4, $5, $6);
            `;
            const detalleAdicionalValues = [
                id,
                product.descripcion,
                product.precio_venta,
                product.excedente,
                product.iva,
                product.total,
            ];
            await client.query(detalleAdicionalQuery, detalleAdicionalValues);
        }

        // Clear existing `servicios_proforma` entries for this proforma
        await client.query('DELETE FROM servicios_proforma WHERE id_proforma = $1', [id]);

        // Re-insert new `servicios_proforma` entries
        for (const servicio of servicios) {
            for (const detalle of servicio.detalles) {
                const serviciosProformaQuery = `
                    INSERT INTO servicios_proforma (
                        id_proforma, 
                        id_servicio, 
                        detalle
                    ) VALUES ($1, $2, $3);
                `;
                const serviciosProformaValues = [id, servicio.id_servicio, detalle];
                await client.query(serviciosProformaQuery, serviciosProformaValues);
            }
        }

        // Insert `serviciosAdicionales` into `servicios_proforma`
        for (const adicional of serviciosAdicionales) {
            const serviciosAdicionalesQuery = `
                INSERT INTO servicios_proforma (
                    id_proforma, 
                    id_servicio, 
                    detalle
                ) VALUES ($1, NULL, $2);
            `;
            const serviciosAdicionalesValues = [id, adicional];
            await client.query(serviciosAdicionalesQuery, serviciosAdicionalesValues);
        }

        await client.query('COMMIT'); // Commit transaction
        res.status(200).json({ message: 'Proforma updated successfully' });
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        console.error('Error updating proforma:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    } finally {
        client.release();
    }
};

const finalizarProforma = async (req, res) => {
    const client = await pool.connect();
    const { id } = req.params;

    try {
        await client.query('BEGIN'); // Start transaction

        // Fetch proforma details
        const proformaQuery = `
            SELECT dp.*, p.nombre_producto, ip.cantidad AS cantidad_existente
            FROM detalleproforma dp
            INNER JOIN producto p ON dp.id_producto = p.id_producto
            INNER JOIN inventario_producto ip ON dp.id_producto = ip.id_producto AND dp.id_inventario = ip.id_inventario
            WHERE dp.id_proforma = $1;
        `;
        const proformaDetails = await client.query(proformaQuery, [id]);

        if (!proformaDetails.rows.length) {
            throw new Error("No hay productos asociados a esta proforma.");
        }

        // Validate if all products can be deducted
        for (const product of proformaDetails.rows) {
            if (product.cantidad > product.cantidad_existente) {
                throw new Error(
                    `El producto ${product.nombre_producto} tiene cantidad insuficiente en el inventario.`
                );
            }
        }

        // Deduct product quantities
        for (const product of proformaDetails.rows) {
            // Simulated `req`
            const simulatedReq = {
                params: {
                    id_inventario: product.id_inventario,
                    id_producto: product.id_producto,
                },
                body: {
                    cantidad: product.cantidad,
                    action: 'eliminar',
                },
            };

            // Simulated `res`
            const simulatedRes = {
                status: (code) => ({
                    json: (response) => {
                        if (code >= 400) {
                            throw new Error(response.message || 'Error updating inventory');
                        }
                        return response;
                    },
                }),
                json: (response) => response, // Handle direct JSON responses
            };

            // Call `updateCantidadInventarioProducto` with simulated `req` and `res`
            await updateCantidadInventarioProducto(simulatedReq, simulatedRes);
        }

      
        // Update proforma status
        const updateProformaQuery = `
            UPDATE proforma
            SET estado = 'Finalizada',
            ultima_modificacion = CURRENT_TIMESTAMP
            WHERE id_proforma = $1;
        `;
        await client.query(updateProformaQuery, [id]);

        await client.query('COMMIT'); // Commit transaction
        res.status(200).json({ message: "Proforma finalizada exitosamente." });
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback transaction
        console.error("Error al finalizar la proforma:", error.message);
        res.status(400).json({ message: error.message });
    } finally {
        client.release();
    }
};



module.exports = {
    getAllProformas,
    getProformaById,
    getProformaByNumeroArchivo,
    createProforma,
    updateProforma,
    deleteProforma,
    finalizarProforma,
};
