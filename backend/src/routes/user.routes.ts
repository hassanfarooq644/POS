import { Router } from 'express'
import { getUsers } from '../controllers/user.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', authenticate, getUsers)

export default router
