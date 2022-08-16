const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const createErr = require('../error/error')
require("dotenv").config();

//function to authorize the requests by verifing the JWT
const authorization = async (req, res, next) => {
  var token = req.headers.authorization;
  if(!token){
    return next(createErr(StatusCodes.BAD_REQUEST ,  "token not found "  ))
  }
  if (!token.startsWith("Bearer")) {
      return next(createErr(StatusCodes.BAD_REQUEST ,  "invalid token "  ))
  }
  token = token.split(" ")[1];

  const payload = jwt.verify(token, process.env.SECRET_KEY);
  if(!payload){
    return next(createErr(StatusCodes.BAD_REQUEST ,  "invalid token "  ))

  }

  try {
    const user = await User.findOne({ _id: payload.id });
    if (!user) {
      return next(createErr(StatusCodes.BAD_REQUEST ,  "invalid token "  ))

    }
    
    //setting the owner id in the request body
    req.user = payload;
    return next();
  } catch (error) {
    return next(createErr(error.status , error.message))

  }
};

module.exports = authorization;
