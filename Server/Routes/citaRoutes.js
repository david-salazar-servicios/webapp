const express = require('express')
const router = express.Router()
const citaController = require('../controllers/citaController')

// Route for getting all citas
router.get('/', citaController.getAllCitas);

// Route for creating a new cita
router.post('/', citaController.createCita);

// Route for updating an existing cita
router.put('/:id', citaController.updateCita);

// Route for deleting a cita by ID
router.delete('/:id', citaController.deleteCita);

module.exports = router;

