const createErr = require('../error/error');
const Cart = require('../models/cart');
const { StatusCodes } = require('http-status-codes')

const getCart = async (req,res,next) => {
    let owner = req.user.id
    try {
        const cart =  await Cart.findOne({owner})
        if(!cart){
            return next(createErr(StatusCodes.NOT_FOUND , "cart not found"))
        }
        res.status(StatusCodes.OK).json({success : true,  cart})
    } catch (error) {
        console.log(error)
        next(createErr(StatusCodes.INTERNAL_SERVER_ERROR,  error.message))
    }
}

const updateCart = async (req,res,next) => {
    let owner = req.user.id
    let {item} =  req.body
    try {
        let cart = await Cart.findOne({ owner });
    
        if (cart) {
          let itemIndex = cart.items.findIndex(i => i.id == item.id);
    
          if (itemIndex > -1) {
            let productItem = cart.items[itemIndex];
            productItem.qty = item.qty;
            cart.items[itemIndex] = productItem;
          } else {
            cart.items.push(item);
          }
          cart = await cart.save();
          return res.status(StatusCodes.OK).json({success : true ,  msg : "cart updated"});

        } else {
          const newCart = await Cart.create({
            owner,
            items: [item]
          });
    
          return res.status(StatusCodes.CREATED).json({success : true ,  msg : "cart updated"});
        }
      } catch (err) {
        console.log(err);
        next(createErr(StatusCodes.INTERNAL_SERVER_ERROR,  err.message))
        
      }
}
const deleteCart = async (req,res,next) => {
    let owner = req.user.id
    try {
        const cart = await Cart.findOneAndDelete({owner})
        res.status(StatusCodes.OK).json({success : true,msg : 'deleted'})


    } catch (error) {
        console.log(error)
        next(createErr(StatusCodes.INTERNAL_SERVER_ERROR,  error.message))
    }
}

const deleteCartItem = async (req,res,next) => {
    let owner = req.user.id
    try {
        const cart = await Cart.findOneAndUpdate({owner} , {$pull :{items : {id : req.params.id}}})
        res.status(StatusCodes.OK).json({success : true,msg : 'deleted cart item'})
    } catch (error) {
        console.log(error)
        next(createErr(StatusCodes.INTERNAL_SERVER_ERROR,  error.message))
    }
}

// const getTotal = async (req,res,next) => {
//   let owner = req.user.id
//   try {
    
//   } catch (error) {
//     console.log(error)
//      next(createErr(StatusCodes.INTERNAL_SERVER_ERROR,  error.message))
//   }
// }

module.exports =  { getCart , updateCart , deleteCart , deleteCartItem }