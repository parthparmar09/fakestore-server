//handling all user related requests
const { StatusCodes } = require("http-status-codes");
//getting user and tempuser models for db queries
const User = require("../models/user.js");
const TempUser = require("../models/tempUser.js");
const bcrypt = require("bcrypt");

const createErr = require("../error/error");
//getting the function to send otp

const getOtp = async (req, res, next) => {
  const email = req.body.email;
  const otp = req.otp.otp;

  try {
    const tempUser = await TempUser.findOne({ email });
    if (!tempUser) {
      const tempUser = await TempUser.create({
        email,
        otp,
        expireAt: Date.now(),
      });
      res
        .status(StatusCodes.CREATED)
        .json({ success: true, msg: "otp sent successfully" });
    } else {
      const tempUser = await TempUser.findOneAndUpdate({ email }, { otp });
      res
        .status(StatusCodes.CREATED)
        .json({ success: true, msg: "otp sent successfully" , otp});
    }
  } catch (error) {

    return next(createErr(StatusCodes.INTERNAL_SERVER_ERROR, "something went wrong"));
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    const tempUser = await TempUser.findOne({ email });
    if (tempUser) {
      if (req.body.otp == tempUser.otp) {
        const user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });
        const token = user.createJwt();
        const tempUser = await TempUser.findOneAndDelete({ email });
        res
          .status(StatusCodes.CREATED)
          .json({ success: true, msg: "registration successfull", token });
      } else {
     
        return next(createErr(StatusCodes.UNAUTHORIZED, "invalid otp"));
      }
    } else {
   
      return next(
        createErr(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "something went wrong please try again"
        )
      );
    }
  } catch (error) {
    if (error.code == 11000) {

      return next(
        createErr(
          StatusCodes.BAD_REQUEST,
          `user with email ${error.keyValue.email} already exists`
        )
      );
    }

    return next(createErr(StatusCodes.NOT_IMPLEMENTED, error.message));
  }
};
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
  
      return next(createErr(StatusCodes.PARTIAL_CONTENT, "all fields are required"));
    }
    const user = await User.findOne({ email });
    if (!user) {

      return next(createErr(StatusCodes.NOT_FOUND, "user not found"));
    }
    const passMatch = await user.comparePass(password);
    if (!passMatch) {
      return next(createErr(StatusCodes.UNAUTHORIZED, "incorrect password"));
    }
    const token = user.createJwt();
    res
      .status(StatusCodes.CREATED)
      .json({ success: true, token, msg: "logged in successfully" });
  } catch (error) {

    return next(createErr(StatusCodes.NOT_IMPLEMENTED, error.message));
  }
};

const changePass = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const tempUser = await TempUser.findOne({ email });
    if (tempUser) {
      const salt = await bcrypt.genSalt(5);
      const npassword = await bcrypt.hash(password, salt);
      if (req.body.otp == tempUser.otp) {
        const user = await User.findOneAndUpdate(
          { email },
          {
            password: npassword,
          },
          {
            runValidators : true
          }
        );
        const tempUser = await TempUser.findOneAndDelete({ email });

        res
          .status(StatusCodes.OK)
          .json({ success: true, msg: "password changed successfully" });
      } else {

        return next(createErr(StatusCodes.UNAUTHORIZED, "invalid otp"));
      }
    } else {
      
      return next(
        createErr(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "something went wrong please try again"
        )
      );
    }
  } catch (error) {

    return next(createErr(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};
module.exports = { getOtp, registerUser, loginUser, changePass };
