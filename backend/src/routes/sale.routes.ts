import { Router } from 'express'
import { createSale } from '../controllers/sale.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/', authenticate, createSale)

export default router
