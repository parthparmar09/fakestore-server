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
    from: 'Fake Store',
    to: req.body.email,
    subject: "OTP for e-mail verification",
    html: `
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Fakestore</a>
    </div>
    <p style="font-size:1.1em">Hello,</p>
    <p>Use the following OTP to complete your process. OTP is valid for 1 minute only</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
    <p style="font-size:0.9em;">Regards,<br />Fakestore</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Fakestore , India</p>
    </div>
  </div>
</div>`,
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
