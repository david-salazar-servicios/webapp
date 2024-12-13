const express = require('express')
const router = express.Router()
const inventarioController = require('../controllers/inventarioController')
const { verifyJWT, isAdmin } = require("../middleware/verifyJWT");

/* router.use(verifyJWT); */

// Routes
router.get("/", inventarioController.getAllInventarios);
router.post("/", inventarioController.createInventario);
router.get("/productos", inventarioController.getAllInventariosProductos);
router.delete("/:id", inventarioController.deleteInventario);
router.get("/:id", inventarioController.getInventarioById);
router.put("/:id", inventarioController.updateInventario);
router.put("/:id_inventario/producto/:id_producto", inventarioController.updateCantidadInventarioProducto);
router.put("/:id_inventario/producto/:id_producto/estante", inventarioController.updateEstanteInventarioProducto);


module.exports = router


