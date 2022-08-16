const mongoose = require('mongoose');

const tempUserSchema =  new mongoose.Schema(
    {
        email : {
            type : String , 
            required : [true , `can't proceed without email`],
            match : [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'provide a valid email',
            ],
        },
        otp : {
            type : Number , 
            maxlength : 4,
            minlegth : 4,
            required : [true , `can't proceed without otp`]
        }
        ,expireAt : {
            type : Date ,
            expires : 60 ,
        }
    } , {
        timestamps : true ,
    }
)



module.exports = mongoose.model('TempUser' , tempUserSchema)