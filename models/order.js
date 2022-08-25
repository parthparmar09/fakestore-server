const mongoose = require('mongoose');
const User = require('./user')
const OrderSchema = new mongoose.Schema({
    order_id : {
        type : String,
    },
    customer_id : {
        type : mongoose.Types.ObjectId,
        ref : User ,
        required : [true , `owner id can't be empty`]
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
    amount : {
        type : Number ,
        required : [true , `amount can't be empty`]
    },
    payment : {
       status : {
        type : Boolean,
        default : false
       },
       payment_id : {
        type : String
       }

    },
    address : {
        pin : {
            type : Number ,
            maxlength : 6,
            minlength : 6,
            required : [true , `pin can't be empty`]
        },
        locality : {
            type : String
        },
        state : {
            type : String,
            required : [true , `state can't be empty`]

        }
    },
    status : {
        type : String,
        enum : ['pending' , 'completed' , 'cancelled'],
        default : 'pending'
    }

})

module.exports = mongoose.model('Order' , OrderSchema)