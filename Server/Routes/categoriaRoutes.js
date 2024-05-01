const express = require('express')
const router = express.Router()
const categoriaController = require('../controllers/categoriaController')
const { verifyJWT, isAdmin } = require("../middleware/verifyJWT");

/* router.use(verifyJWT); */

router.route("/").get(categoriaController.getAllCategorias);

router.route("/").post(categoriaController.createNewCategoria);

router.delete("/:id", categoriaController.deleteCategoria);

router.get("/:id", categoriaController.getCategoriaById);

router.put("/:id", categoriaController.updateCategoria);

module.exports = router


