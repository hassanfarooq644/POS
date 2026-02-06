import { Router } from 'express'
import { getProducts, createProduct, getProductById, updateProduct, deleteProduct } from '../controllers/product.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import { upload } from '../middlewares/upload.middleware.js'

const router = Router()

// Custom upload handler to provide better error messages
const handleUpload = (req: any, res: any, next: any) => {
    upload.single('picture')(req, res, (err: any) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: 'File size too large. Max 5MB allowed.' })
            }
            return res.status(400).json({ error: err.message })
        }
        next()
    })
}

router.get('/', authenticate, getProducts)
router.post('/', authenticate, handleUpload, createProduct)
router.get('/:id', authenticate, getProductById)
router.put('/:id', authenticate, handleUpload, updateProduct)
router.delete('/:id', authenticate, deleteProduct)

export default router
