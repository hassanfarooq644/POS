import { Router } from 'express'
import { getCategories, createCategory, getCategoryById, updateCategory, deleteCategory } from '../controllers/category.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', authenticate, getCategories)
router.post('/', authenticate, createCategory)
router.get('/:id', authenticate, getCategoryById)
router.put('/:id', authenticate, updateCategory)
router.delete('/:id', authenticate, deleteCategory)

export default router
