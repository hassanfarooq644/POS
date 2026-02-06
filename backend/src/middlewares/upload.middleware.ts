import multer from 'multer'
import path from 'path'
import fs from 'fs'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'assets/product-images'
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true })
        }
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

export const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/
        const mimetype = filetypes.test(file.mimetype)
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

        if (mimetype && extname) {
            return cb(null, true)
        }
        cb(new Error('Only images are allowed (jpeg, jpg, png, webp)'))
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
})
