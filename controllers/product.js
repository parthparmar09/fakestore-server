//all controllers for contact realted requests
const { StatusCodes } = require('http-status-codes')
const fs = require('fs');
require('dotenv').config()
//getting the contact model to work with database
const Product =  require('../models/product')
const createErr = require('../error/error')

const getAllProducts = async (req,res,next) => {
    try {
        const products = await Product.find({})
        res.status(StatusCodes.OK).json({success : true , products})
    } catch (error) {
        console.log(error)
        return next(createErr(StatusCodes.INTERNAL_SERVER_ERROR , error.message))
    }
}
const getCatProducts = async (req,res,next) => {
    try {
        const products = await Product.find({category : req.params.category})
        res.status(StatusCodes.OK).json({success : true , products})
    } catch (error) {
        console.log(error)
        return next(createErr(StatusCodes.INTERNAL_SERVER_ERROR , error.message))
    }
}

const getMyProducts = async (req,res,next) => {
    try {
        const products = await Product.find({owner : req.user.id})
        res.status(StatusCodes.OK).json({success : true , products})
    } catch (error) {
        console.log(error)
        return next(createErr(StatusCodes.INTERNAL_SERVER_ERROR , error.message))
    }
}

const addNewProduct= async (req,res,next) => {
    try {
        const product = await Product.create({
            ...req.body , owner : req.user.id , image : `${process.env.BASE_URL}/images/${req.file.filename}`
        })
        res.status(StatusCodes.OK).json({success : true , msg : 'product added'  , product})

    } catch (error) {
        console.log(error)
        return next(createErr(StatusCodes.INTERNAL_SERVER_ERROR , error.message))
    }
}
const getProduct = async (req,res,next) => {
    try {
        const product =  await Product.findOne({id : req.params.id})
        if(!product){
        return next(createErr(StatusCodes.NOT_FOUND , "product not found"))
        }
        res.status(StatusCodes.OK).json({success : true , product})


    } catch (error) {
        console.log(error)
        return next(createErr(StatusCodes.INTERNAL_SERVER_ERROR , error.message))
    }
}
const deleteProduct = async (req,res,next) => {
    try {
        const product =  await Product.findOne({id : req.params.id , owner : req.user.id})

        if(!product){
        return next(createErr(StatusCodes.INTERNAL_SERVER_ERROR , `can't perform delete operation`))
        }
        fs.unlink(`./files/${product.image.split('/')[2]}`, (err) => {
           return  null
        }); 
        const del =  await Product.findOneAndDelete({id : req.params.id})
        res.status(StatusCodes.OK).json({success : true , msg : "product deleted successfully"})

    } catch (error) {
        console.log(error)
        return next(createErr(StatusCodes.INTERNAL_SERVER_ERROR , error.message))
    }
}

const editProduct = async (req,res,next) => {
    try {
        const product =  await Product.findOne({id : req.params.id , owner :req.user.id })
        if(!product){
        return next(createErr(StatusCodes.INTERNAL_SERVER_ERROR , `can't perform update operation`))
        }
        const edit =  await Product.findOneAndUpdate({id : req.params.id} , {...req.body})

        res.status(StatusCodes.OK).json({success : true , msg : "product updated successfully" })
        
    } catch (error) {
        console.log(error)
        return next(createErr(StatusCodes.INTERNAL_SERVER_ERROR , error.message))
    }
}




module.exports = {getAllProducts , getCatProducts, addNewProduct , getProduct ,getMyProducts, editProduct , deleteProduct}