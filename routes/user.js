const router = require('express').Router();
const sendOtp = require('../middleware/authentication')

const { getOtp , registerUser , loginUser , changePass } = require('../controllers/user')

router.route('/register').post(registerUser).get((req,res,next) =>{
    res.render('register.pug')
})
router.route('/authentication').post(sendOtp ,getOtp)
router.route('/login').post(loginUser).get((req,res,next) =>{
    res.render('login.pug')
})
router.route('/changePass').post(changePass)

module.exports =  router