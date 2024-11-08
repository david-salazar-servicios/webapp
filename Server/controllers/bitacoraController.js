// bitacoraController.js
const pool = require('../db');

// Function to log actions to the BitacoraMovimiento table
const logMovement = async (user = {}, description,module) => {
    // Ensure each field has a default value if it's missing or empty
    const userId = user.userId || null;
    const username = user.username || '';
    const email = user.email || '';
    const roles = Array.isArray(user.roles) ? user.roles : [];

    const query = `
        INSERT INTO BitacoraMovimiento (userId, username, email, roles, description,module)
        VALUES ($1, $2, $3, $4, $5,$6)
    `;
    const values = [
        userId,
        username,
        email,
        roles,
        description,
        module,
    ];

    try {
        await pool.query(query, values);
        console.log('Movement logged successfully');
    } catch (error) {
        console.error('Error logging movement:', error);
    }
};

const getAllBitacoraMovimiento = async (req, res) => {
    
    try {
        // Execute the SQL query to fetch all services
        const queryResult = await pool.query('SELECT * FROM bitacoramovimiento');

        // Extract the service data from the query result
        const bitacora = queryResult.rows; 

        // Return the list of services
        res.json(bitacora);
    } catch (error) {
        console.error("Error retrieving inventarios:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = {
    logMovement,
    getAllBitacoraMovimiento
};
