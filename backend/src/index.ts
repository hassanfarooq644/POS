import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { checkDatabaseConnection } from './utils/db.utils.js'

// Routes
import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'
import userRoutes from './routes/user.routes.js'
import saleRoutes from './routes/sale.routes.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

var corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json())

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Inventory Management System API is running' })
})


app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/sales', saleRoutes)

app.listen(PORT, async () => {
    await checkDatabaseConnection();
    console.log(`Server is running on port ${PORT}`)
})
