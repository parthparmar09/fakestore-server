//requiring nodemailer to send emails
const { StatusCodes } = require('http-status-codes');
const nodemailer =  require('nodemailer')
const createErr  =  require('../error/error')

//dotenv file for environment variables
require('dotenv').config()
//supplying the user credentials and service form
const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SERVER_EMAIL,
    pass: process.env.SERVER_PASS,
  },


});
//function to send emails using nodemailer
function sendOtp(req,res,next) {
  const otp = Math.floor(1000 + (9999 - 1000) * Math.random());

    //providing options for the mail 
  var mailOptions = {
    from: 'Fake Store ',
    to: req.body.email,
    subject: "OTP",
    html: `<h3>${otp}</h3>`,
  };

  //sending the mail to given emails
  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      // return res.status(400).json({success : false , msg : });
      return next(createErr(StatusCodes.INTERNAL_SERVER_ERROR , 'otp not sent'  ))

    }
    req.otp = {otp}
    next();
  });
}

//exporting the function
module.exports = sendOtp;
