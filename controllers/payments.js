const crypto = require("crypto");
const Razorpay = require("razorpay");
const createErr = require('../error/error')


const instance = new Razorpay({
  key_id: process.env.PAY_ID,
  key_secret: process.env.KEY_SECRET,
});


const startOrder = (req, res, next) => {
  let params = {
    amount : req.body.amount,
    currency: "INR",
    receipt: `${Date.now()}`,
    payment_capture: "1",
  }
  instance.orders
    .create(params)
    .then((data) => {
      req.order = data.id
      return next()
    })
    .catch((error) => {
      req.err= error
      return next()
    });
};

const verifyOrder = (req, res, next) => {
  body = req.body.order_id + "|" + req.body.payment_id;

  let expectedSignature = crypto
    .createHmac("sha256", process.env.KEY_SECRET)
    .update(body.toString())
    .digest("hex");
  let stat = { success : false };
  if (expectedSignature === req.body.signature) {
    stat = { success : true , payment_id : req.body.payment_id}
  }
  req.response = stat
  return next()
 
};


module.exports = {startOrder , verifyOrder}