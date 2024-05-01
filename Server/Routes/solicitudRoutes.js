const express = require('express')
const router = express.Router()
const solicitudController = require('../controllers/solicitudController')

/* router.use(verifyJWT); */

router.route("/confirmar").post(solicitudController.crearSolicitud_AgregarServicios);
router.route("/").get(solicitudController.getAllSolicitudes);
module.exports = router


