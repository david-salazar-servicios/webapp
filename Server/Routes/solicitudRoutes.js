const express = require('express');
const router = express.Router();
const solicitudController = require('../controllers/solicitudController');

/* router.use(verifyJWT); */
router.route("/:solicitudId/estado").put(solicitudController.updateSolicitudEstado);
router.route("/confirmar").post(solicitudController.crearSolicitud_AgregarServicios);
router.route("/").get(solicitudController.getAllSolicitudes);
router.route("/:solicitudId").get(solicitudController.getSolicitudById);
router.route("/:solicitudId/fecha_preferencia").put(solicitudController.updateSolicitudFechaPreferencia);
router.route("/report/service-solicitudes").get(solicitudController.getServiceSolicitudesReport);
module.exports = router;
