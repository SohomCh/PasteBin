
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const {User}=require('../models/user.model')


async function registerUser(userData){

    const{name,email,password}=userData

    //checking if email exists

    const existingUser=await User.findOne({email})

    if(existingUser){
        throw new Error("User already exists")

    }

    //has Password

    const hashedPassword=await bcrypt.hash(password,10)


    //create user

    const user=await User.create({
        name,
        email,
        password:hashedPassword
    })

    //return safe user data
    return {
    id: user._id,
    name: user.name,
    email: user.email
}

    

}



async function loginUser(userData){
    const{email,password}=userData

    //check user
    const user= await User.findOne({email});
    if(!user){
        throw new Error("Invalid Credentials")
    }

    const isMatch=await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error("Invalid Credentials")
    }


    //verify jet
    const token=jwt.sign({
        userId:user._id,
        email:user.email
    },process.env.JWT_SECRET,
    {
        expiresIn:"1d"
    })
    return {
        token,

    user:{
         _id: user._id,
            name: user.name,
            email: user.email

    }
}
}








module.exports={
    registerUser,
    loginUser
}