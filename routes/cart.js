const router = require('express').Router();
const { getCart , updateCart , deleteCart , deleteCartItem } =  require('../controllers/cart')

router.route('/').get(getCart).patch(updateCart).delete(deleteCart)
router.route('/:id').delete(deleteCartItem)


module.exports =  router