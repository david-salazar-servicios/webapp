const express = require('express')
const router = express.Router()
const productoController = require('../controllers/productoController')
const { verifyJWT, isAdmin } = require("../middleware/verifyJWT");

/* router.use(verifyJWT); */

// Routes
router.get("/", productoController.getAllProductos);
router.post("/", productoController.createProducto);
router.delete("/:id", productoController.deleteProducto);
router.get("/:id", productoController.getProductoById);
router.put("/:id", productoController.updateProducto);

module.exports = router


