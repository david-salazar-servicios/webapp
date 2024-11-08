const pool = require('../db');

// Get all IBAN records
const getAllCuentaIban = async (req, res) => {
    try {
        const queryResult = await pool.query('SELECT * FROM cuentaiban');
        res.json(queryResult.rows);
    } catch (error) {
        console.error("Error retrieving cuentaIban:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Get a single IBAN record by id_cuenta
const getCuentaIbanById = async (req, res) => {
    const { id } = req.params;
    try {
        const queryResult = await pool.query('SELECT * FROM cuentaiban WHERE id_cuenta = $1', [id]);
        if (queryResult.rows.length === 0) {
            return res.status(404).json({ message: "Cuenta IBAN not found." });
        }
        res.json(queryResult.rows[0]);
    } catch (error) {
        console.error("Error retrieving cuentaIban:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Create a new IBAN record
const createCuentaIban = async (req, res) => {
    const { id_iban, tipobanco, moneda } = req.body;
    try {
        const queryResult = await pool.query(
            'INSERT INTO cuentaiban (id_iban, tipobanco, moneda) VALUES ($1, $2, $3) RETURNING *',
            [id_iban, tipobanco, moneda]
        );
        res.json(queryResult.rows[0]);
    } catch (error) {
        console.error("Error creating cuentaIban:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Update an existing IBAN record
const updateCuentaIban = async (req, res) => {
    const { id } = req.params;
    const { tipobanco, moneda,id_iban } = req.body;
    console.log(req.body)
    try {
        const queryResult = await pool.query(
            'UPDATE cuentaiban SET tipobanco = $1, moneda = $2, id_iban = $3  WHERE id_cuenta = $4 RETURNING *',
            [tipobanco, moneda, id_iban, id]
        );
        if (queryResult.rows.length === 0) {
            return res.status(404).json({ message: "Cuenta IBAN not found." });
        }
        res.json(queryResult.rows[0]);
    } catch (error) {
        console.error("Error updating cuentaIban:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Delete an IBAN record
const deleteCuentaIban = async (req, res) => {
    const { id } = req.params;
    try {
        const queryResult = await pool.query('DELETE FROM cuentaiban WHERE id_cuenta = $1 RETURNING *', [id]);
        if (queryResult.rows.length === 0) {
            return res.status(404).json({ message: "Cuenta IBAN not found." });
        }
        res.json({ message: 'Cuenta IBAN deleted successfully' });
    } catch (error) {
        console.error("Error deleting cuentaIban:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = {
    getAllCuentaIban,
    getCuentaIbanById,
    createCuentaIban,
    updateCuentaIban,
    deleteCuentaIban
};
