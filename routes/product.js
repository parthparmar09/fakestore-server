const router = require('express').Router();
const authorization = require("../middleware/authorization");


const upload = require('../middleware/multer')

const {getAllProducts , addNewProduct , getProduct ,getMyProducts, editProduct , deleteProduct , getCatProducts} = require('../controllers/product')

router.route('/myProducts').get(authorization,getMyProducts)
router.route('/').get(getAllProducts).post(authorization,upload.single('image') , addNewProduct)
router.route('/:id').get(getProduct).patch(authorization,editProduct).delete(authorization,deleteProduct)
router.route('/category/:category').get(getCatProducts)



module.exports =  router
