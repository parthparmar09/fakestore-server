//requiring multer to store the files from requests
const multer = require('multer');

//defining the storage directory and file names
const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null , './files')
    },
    filename : (req,file,cb) =>{
        cb(null , Date.now() + file.originalname)
    }
})
//setting up the uploads limits
const upload = multer({
    storage,
    limits : {
        fileSize : 1024*1024*1,
    },
    fileFilter : (req,file,cb) => {
        if(!(file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' )){
            cb(null , false )
            return cb(new Error('only .jpg or .jpeg files are allowed '))
        }
        cb(null , true)
    }
})

//exporting the upload function
module.exports = upload