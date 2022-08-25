const router = require('express').Router();
const {placeOrder ,confirmOrder, cancelOrder ,getOrders , getOrder , completeOrder} = require('../controllers/order')
const {startOrder , verifyOrder} = require('../controllers/payments')


router.route('/').post(startOrder ,placeOrder).get(getOrders)
router.route('/confirm').post(verifyOrder , confirmOrder)
router.route('/:id').delete(cancelOrder).get(getOrder).patch(completeOrder)




module.exports =  router