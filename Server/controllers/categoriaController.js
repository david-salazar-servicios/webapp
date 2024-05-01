// Asegúrate de que el archivo de conexión a la base de datos esté configurado correctamente.
const pool = require('../db');


const getAllCategorias = async (req, res) => {
    try {
        // Execute the SQL query to fetch all users
        const queryResult = await pool.query('SELECT * FROM categoria'); // Asegúrate de que 'usuario' es el nombre correcto de tu tabla

        // Extract the user data from the query result
        const categorias = queryResult.rows; // En pg, los resultados están en 'rows'

        // Return the list of users
        res.json(categorias);
    } catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// @desc Create a new category
// @route POST /
// @access Private
const createNewCategoria = async (req, res) => {
    try {
        const { nombre } = req.body;
        const newCategory = await pool.query(
            'INSERT INTO categoria (nombre) VALUES ($1) RETURNING *', 
            [nombre]
        );

        res.json(newCategory.rows[0]);
    } catch (error) {
        console.error("Error creating new category:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// @desc Delete a category by ID
// @route DELETE /:id
// @access Private
const deleteCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM categoria WHERE id_categoria = $1', [id]);

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// @desc Get a single category by ID
// @route GET /:id
// @access Private
const getCategoriaById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await pool.query('SELECT * FROM categoria WHERE id_categoria = $1', [id]);

        if (category.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(category.rows[0]);
    } catch (error) {
        console.error("Error retrieving category:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// @desc Update a category by ID
// @route PUT /:id
// @access Private
const updateCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        const updatedCategory = await pool.query(
            'UPDATE categoria SET nombre = $1 WHERE id_categoria = $2 RETURNING *',
            [nombre, id]
        );

        if (updatedCategory.rows.length === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(updatedCategory.rows[0]);
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = {
    getAllCategorias,
    createNewCategoria,
    deleteCategoria,
    getCategoriaById,
    updateCategoria
};
