const router = require('express').Router();
const {placeOrder ,confirmOrder, cancelOrder} = require('../controllers/order')
const {startOrder , verifyOrder} = require('../controllers/payments')


router.route('/').post(startOrder ,placeOrder)
router.route('/confirm').post(verifyOrder , confirmOrder)
router.route('/:id').delete(cancelOrder)



module.exports =  router