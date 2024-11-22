    const express = require('express')
    const router = express.Router()
    const proformaController = require('../controllers/proformaController')

    /* router.use(verifyJWT); */

    // Routes
    router.get("/", proformaController.getAllProformas);
    router.post("/", proformaController.createProforma);
    router.delete("/:id", proformaController.deleteProforma);
    router.put("/:id", proformaController.updateProforma);
    router.get("/:id", proformaController.getProformaById);
    router.put("/:id/finalizar", proformaController.finalizarProforma);
    router.get("/numero_archivo/:id", proformaController.getProformaByNumeroArchivo);
    
    module.exports = router


