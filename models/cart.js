const mongoose = require('mongoose');
const User =  require('./user')

const CartSchema =  new mongoose.Schema({
    owner : {
        type :  mongoose.Types.ObjectId,
        ref :  User, 
        required : [true , `owner can't be empty`]
    },
    items : [
        {
            id : {
                type : Number , 
                required : [true , `id can't be empty`]
            },
            qty : {
                type : Number , 
                default : 1,
                min : [1 , `qty is too low`]
            },
            title : {
                type : String,
                required : [true , `title can't be empty`]

            },
            price : {
                type : Number,
                required : [true , `price can't be empty`]

            },
            image : {
                type : String,
            }
        }
    ],
})


module.exports = mongoose.model('Cart' , CartSchema)