const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const { verifyJWT, isAdmin } = require("../middleware/verifyJWT");

/* router.use(verifyJWT); */

router.route("/").get([isAdmin], usersController.getAllUsers);

router.route("/").post(usersController.createNewUser);

router.delete("/:id", usersController.deleteUser);

router.get("/:id", usersController.getUserById);

router.put("/:id", usersController.updateUser);

router.post("/:id/roles", usersController.assignRoleToUser);

router.get('/:id/roles', usersController.getUserRole);

router.put('/:id/roles', usersController.updateUserRoles);

router.put('/', usersController.updateUserPassword);

module.exports = router


