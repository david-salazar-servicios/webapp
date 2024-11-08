const express = require('express')
const router = express.Router()
const bitacoraController = require('../controllers/bitacoraController')


router.route("/").get(bitacoraController.getAllBitacoraMovimiento);



module.exports = router
