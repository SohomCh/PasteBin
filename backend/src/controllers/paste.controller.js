const { createPaste, getPasteById,getMyPastes,deletePaste,editPaste, } = require("../services/paste.service")

// CREATE PASTE
async function createPasteController(req, res) {
    try {
        const result = await createPaste(req.body,req.user.userId)

        res.status(201).json({
            success: true,
            data: result
        })

    } catch (error) {

        // Bad request (validation/input issue)
        res.status(400).json({
            success: false,
            error: error.message
        })
    }
}


// GET FULL PASTE
async function getPasteByIdController(req, res) {

    try {
        const paste = await getPasteById(req.params.id,
            req.user?.userId)

        res.status(200).json({
            success: true,
            data: paste
        })

    } catch (error) {

        // Paste not found
        if (error.message === "Paste not found") {
            return res.status(404).json({
                success: false,
                error: error.message
            })
        }

        // Paste expired
        if (error.message === "Paste expired") {
            return res.status(410).json({
                success: false,
                error: error.message
            })
        }

        //Forbidden
        if (error.message === "Forbidden") {
            return res.status(403).json({
                success: false,
                error: error.message
            })
        }

        // Internal server error
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}


// GET RAW CONTENT
async function getContentByIdController(req, res) {

    try {
        const paste = await getPasteById(req.params.id, req.user?.userId)

        res.type("text/plain").send(paste.content)

    } catch (error) {

        // Paste not found
        if (error.message === "Paste not found") {
            return res.status(404).json({
                success: false,
                error: error.message
            })
        }

        // Paste expired
        if (error.message === "Paste expired") {
            return res.status(410).json({
                success: false,
                error: error.message
            })
        }

        // Internal server error
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}


async function getMyPastesController(req,res){
 
    try{

        const pastes=await getMyPastes(req.user.userId)

        return res.status(200).json({
            success:true,
            data:pastes
        })

    }
    catch(error){

        return res.status(500).json({
            success:false,
            error:error.message
        })


    }
}


async function deletePasteController(req,res){

    try{
        const result=await deletePaste(
            req.params.id,
            req.user.userId
        )
        return res.status(200).json({
            success: true,
            data: result
        })

    }
    catch(error){
        if (error.message === "Paste not found") {
            return res.status(404).json({
                success: false,
                error: error.message
            })
    }

    //unauthorized

    if (error.message === "Unauthorized") {
            return res.status(403).json({
                success: false,
                error: error.message
            })
        }

        return res.status(500).json({
            success: false,
            error: error.message
        })
    }

}


async function editPasteController(req,res){

    try{

        const result=await editPaste(req.params.id,req.user.userId,req.body)

        return res.status(200).json({
            success:true,
            data:result
        })


    }
    catch(error){
        if(error.message=="Paste not found"){
            return res.status(404).json({
                success:false,
                error:error.message
            })
        }

        if(error.message=="Unauthorized"){
            return res.status(403).json({
                success:false,
                error:error.message
            })
        }

          return res.status(500).json({
            success: false,
            error: error.message
        })


    }



}
module.exports = {
    createPasteController,
    getPasteByIdController,
    getContentByIdController,
    getMyPastesController,
    deletePasteController,
    editPasteController,
}