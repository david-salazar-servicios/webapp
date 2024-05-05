const express = require('express')
const router = express.Router()
const rolesController = require('../controllers/rolesController')
const { verifyJWT, isAdmin } = require("../middleware/verifyJWT");

/* router.use(verifyJWT); */

// Routes
router.get("/", [isAdmin], rolesController.getAllRoles);
router.post("/", rolesController.createNewRole);
router.delete("/:id", rolesController.deleteRole);
router.get("/:id", rolesController.getRoleById);
router.put("/:id", rolesController.updateRole);
router.get("/usuarios/all", rolesController.getAllUserRoles);

module.exports = router


