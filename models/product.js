const mongoose = require('mongoose');
const User =  require('./user')
const ProductSchema =  new mongoose.Schema({
    id : {
        type : Number,
        required : [true , `id can't be empty`]
    },
    title : {
        type : String, 
        required : [true , `title can't be empty`]
    },
    description : {
        type : String, 
    } ,
    price : {
        type : Number, 
        required : [true , `price can't be empty`]
    } , 
    category : {
        type : String, 
        required : [true , `category can't be empty`]
    } , 
    image : {
        type : String, 
        unique : true
    } , 
    owner : {
        type : mongoose.Types.ObjectId,
        ref : User ,
        required :  [true , `owner can't be empty`]
    },
    rating: {
        rate: {
            type : Number
        },
        count: {
            type : Number
        }
        }
} , {timestamps : true})

module.exports = mongoose.model('Prodcut' , ProductSchema)