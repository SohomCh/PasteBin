const jwt=require('jsonwebtoken')

async function optionalAuthMiddleware(req,res,next){
    try{

        const authHeader=req.headers.authorization

        //No token?

        if(!authHeader){
            return next()
        }

        //Extract token

        const token=authHeader.split(" ")[1]

        //verify token


        const decoded=jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        //Attach token

        req.user=decoded
        next()

        

    }

    catch(error){
        //Invalid token

        //Ignore and continue

        next()


    }
}
module.exports={
    optionalAuthMiddleware
}