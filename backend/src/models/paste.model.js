const mongoose = require ('mongoose')



const {Schema}=mongoose;

const pasteSchema= new Schema({

    pasteId : {
        type:String,
        required:true,
        unique: true
    },
    content :{ 
        type:String,
        required:true,
    
    },
    createdAt: {
  type: Date,
  default: Date.now
},


    //TTL for mongodb
    expiresAt:{
        type:Date,
        index:{expires:0}
        

    },
    views:{
        type :Number,
        default:0
    },
    userId :{

        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true


    },
    isPublic:{
    type:Boolean,
    default:true
    }
    
})


const Paste=mongoose.model('Paste',pasteSchema);

module.exports={
    Paste
}