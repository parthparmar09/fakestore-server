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
const cancelOrder = async (req, res, next) => {
  try {
    res.send("deleting");
  } catch (error) {
    console.log(error);
    return next(createErr(500, error.message));
  }
};

module.exports = { placeOrder, confirmOrder, cancelOrder };
