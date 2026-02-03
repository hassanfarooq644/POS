import { Router } from 'express'
import { getProducts, createProduct, getProductById, updateProduct, deleteProduct } from '../controllers/product.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', authenticate, getProducts)
router.post('/', authenticate, createProduct)
router.get('/:id', authenticate, getProductById)
router.put('/:id', authenticate, updateProduct)
router.delete('/:id', authenticate, deleteProduct)

export default router
