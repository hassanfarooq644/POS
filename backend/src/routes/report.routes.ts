import { Router } from 'express'
import { getLowStockProducts, getSalesSummary } from '../controllers/report.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/low-stock', authenticate, getLowStockProducts)
router.get('/sales-summary', authenticate, getSalesSummary)

export default router
