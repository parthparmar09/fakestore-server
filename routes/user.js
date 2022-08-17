const router = require('express').Router();
const sendOtp = require('../middleware/authentication')
const authorization = require('../middleware/authorization')

const { getOtp , registerUser , loginUser , changePass ,getUser} = require('../controllers/user')

router.route('/register').post(registerUser).get((req,res,next) =>{
    res.render('register.pug')
})
router.route('/authentication').post(sendOtp ,getOtp)
router.route('/login').post(loginUser)
router.route('/changePass').post(changePass)
router.route('/').get(authorization , getUser)

module.exports =  router