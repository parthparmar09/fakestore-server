const createErr = require("../error/error");
const Order = require("../models/order");
const { StatusCodes } = require("http-status-codes");

const placeOrder = async (req, res, next) => {
  if (req.err) {
    return next(createErr(req.err.statusCode, req.err.error.description));
  }
  const owner = req.user.id;
  try {
    const params = {
      order_id: req.order,
      customer_id: owner,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    };
    const order = await Order.create(params);
    res.status(200).json({ success: true, order_id: order.order_id });
  } catch (error) {
    console.log(error);
    return next(createErr(500, error.message));
  }
};
const confirmOrder = async (req, res, next) => {
  if (!req.response.success) {
    return next(createErr(StatusCodes.NOT_ACCEPTABLE, "order not confirmed"));
  }
  try {
    const order = await Order.findOne({
      customer_id: req.user.id,
      order_id: req.body.order_id,
    });
    order.payment = {
      status: true,
      payment_id: req.body.payment_id,
    };
    order.save();

    res.status(200).json({ success: true, msg: "order placed succesfully" });
  } catch (error) {
    console.log(error);
    return next(createErr(500, error.message));
  }
};


const getOrders = async (req,res,next) => {
  try {
    const orders = await Order.find({customer_id : req.user.id})
    if(!orders){
    return next(createErr(StatusCodes.NOT_FOUND, 'no orders found'));

    }
    res.status(StatusCodes.OK).json({success : true , orders})

  } catch (error) {
    console.log(error);

    return next(createErr(500, error.message));
    
  }
}

const getOrder = async (req,res,next) => {
  try {
    const order = await Order.find({customer_id : req.user.id , order_id : req.params.id})
    if(!order){
    return next(createErr(StatusCodes.NOT_FOUND, 'no orders found'));
    }
    res.status(StatusCodes.OK).json({success : true , order})
  } catch (error) {
    console.log(error);

    return next(createErr(500, error.message));
    
  }
} 

const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOneAndUpdate({customer_id : req.user.id , order_id : req.params.id} , {status : 'cancelled'})
    res.status(StatusCodes.OK).json({success : true , msg :'order cancelled'})
  } catch (error) {
    console.log(error);
    return next(createErr(500, error.message));
  }
};
const completeOrder = async (req, res, next) => {
  try {
    const order = await Order.findOneAndUpdate({ order_id : req.params.id} , {status : 'completed'})
    res.status(StatusCodes.OK).json({success : true , msg :'order completed'})
  } catch (error) {
    console.log(error);
    return next(createErr(500, error.message));
  }
};

module.exports = { placeOrder, confirmOrder, cancelOrder ,getOrders , getOrder ,completeOrder};
