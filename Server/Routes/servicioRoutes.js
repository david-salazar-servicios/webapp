const express = require('express')
const router = express.Router()
const servicioController = require('../controllers/servicioController')
const { verifyJWT, isAdmin } = require("../middleware/verifyJWT");

/* router.use(verifyJWT); */

router.route("/").get(servicioController.getAllServicios);

router.route("/").post(servicioController.createNewServicio);

router.delete("/:id", servicioController.deleteServicio);

router.get("/:id", servicioController.getServicioById);

router.put("/:id", servicioController.updateServicio);

router.route("/usuarios_servicios").post(servicioController.addUsuarioServicio);

router.route("/usuarios_servicios/:id").get(servicioController.getUsuarioServicioById);

router.route("/usuarios_servicios/by-ids").post(servicioController.getDetalleServiciosByIds);

router.delete('/usuarios_servicios/:id_usuario/:id_servicio', servicioController.deleteUsuarioServicioById);

router.delete("/usuarios_servicios/:id_usuario",servicioController.deleteAllUsuarioServicio);

router.get("/images",servicioController.getServicesImages)

module.exports = router


