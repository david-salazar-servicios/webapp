const express = require('express')
const router = express.Router()
const rolesController = require('../controllers/rolesController')
const { verifyJWT, isAdmin } = require("../middleware/verifyJWT");

/* router.use(verifyJWT); */

router.route("/").get([isAdmin], rolesController.getAllRoles);

router.route("/").post(rolesController.createNewRole);

router.delete("/:id", rolesController.deleteRole);

router.get("/:id", rolesController.getRoleById);

router.put("/:id", rolesController.updateRole);

module.exports = router


