const express = require('express')

const router = express.Router()

const { createPasteController,getPasteByIdController,getContentByIdController,getMyPastesController,deletePasteController,editPasteController} = require('../controllers/paste.controller')
const{authMiddleware}=require("../middlewares/auth.middleware")
const{optionalAuthMiddleware}=require("../middlewares/optionalAuth.middleware")


// POST /paste
router.post("/paste", authMiddleware,createPasteController)


//GET ROUTES

router.get("/paste/my", authMiddleware, getMyPastesController)
router.get("/paste/:id",optionalAuthMiddleware, getPasteByIdController)
router.get("/raw/:id",optionalAuthMiddleware,getContentByIdController)


//UPDATE ROUTES

router.patch(
    "/paste/:id",
    authMiddleware,
    editPasteController
)

//DELETE ROUTES
router.delete("/paste/:id",
    authMiddleware,
    deletePasteController)



module.exports = router