const router = require('express').Router();

const upload = require('../middleware/multer')

const {getAllProducts , addNewProduct , getProduct ,getMyProducts, editProduct , deleteProduct , getCatProducts} = require('../controllers/product')

router.route('/myProducts').get(getMyProducts)
router.route('/').get(getAllProducts).post(upload.single('image') , addNewProduct)
router.route('/:id').get(getProduct).patch(editProduct).delete(deleteProduct)
router.route('/category/:category').get(getCatProducts)



module.exports =  router
