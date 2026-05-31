const { registerUser,loginUser } = require("../services/auth.services.js")

async function registerController(req, res) {

    try {

        const user = await registerUser(req.body)

        return res.status(201).json({
            success: true,
            data: user
        })

    } catch (error) {

        if(error.message === "User already exists"){
            return res.status(409).json({
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

async function loginController(req,res){

    try{
        const result=await loginUser(req.body);

        return res.status(200).json({
            success:true,
            data:result
        })
    }

    catch(error){

        if(error.message=="Invalid Credentials"){
            return res.status(401).json({
                success:false,
                error:error.message
            })
        }

        return res.status(500).json({
            success:false,
            error:error.message
        })
    }
}
module.exports = {
    registerController,
    loginController
}