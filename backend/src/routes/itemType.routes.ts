import { Router } from 'express'
import { getItemTypeById, getItemTypes, createItemType, updateItemType, deleteItemType } from '../controllers/itemType.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', authenticate, getItemTypes)
router.post('/', authenticate, createItemType)
router.get('/:id', authenticate, getItemTypeById)
router.put('/:id', authenticate, updateItemType)
router.delete('/:id', authenticate, deleteItemType)

export default router
