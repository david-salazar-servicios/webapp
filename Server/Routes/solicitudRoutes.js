const express = require('express')
const router = express.Router()
const solicitudController = require('../controllers/solicitudController')

/* router.use(verifyJWT); */
router.route("/:solicitudId/estado").put(solicitudController.updateSolicitudEstado);
router.route("/confirmar").post(solicitudController.crearSolicitud_AgregarServicios);
router.route("/").get(solicitudController.getAllSolicitudes);
router.route("/:solicitudId").get(solicitudController.getSolicitudById);
module.exports = router


