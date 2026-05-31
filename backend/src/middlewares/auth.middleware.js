const jwt=require('jsonwebtoken')

async function authMiddleware(req,res,next){
    try{

        const authHeader=req.headers.authorization

        //no token
        if(!authHeader){
            return res.status(401).json({
                success:false,
                error:"No token Provided"
            })
        }

        //split
        const token=authHeader.split(" ")[1]

        //verify
        const decoded=jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        //attach to request
        req.user=decoded

        //continue
        next()

    }
    catch(error){
        return res.status(401).json({
            success: false,
            error: "Invalid token"
        })
    }
}

module.exports={
    authMiddleware,
}
