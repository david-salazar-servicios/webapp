const express = require('express')
const router = express.Router()
const cuentaibanController = require('../controllers/cuentaibanController')

// Route for getting all citas
router.get('/', cuentaibanController.getAllCuentaIban);

// Route for creating a new cita
router.post('/', cuentaibanController.createCuentaIban);

// Route for updating an existing cita
router.put('/:id', cuentaibanController.updateCuentaIban);

// Route for deleting a cita by ID
router.get('/:id', cuentaibanController.getCuentaIbanById);

// Route for deleting a cita by ID
router.delete('/:id', cuentaibanController.deleteCuentaIban);

module.exports = router;

