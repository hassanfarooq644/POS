import type { Request, Response } from 'express'
import { prisma } from '../prisma.js'

export const getLowStockProducts = async (req: Request, res: Response) => {
    try {
        const threshold = Number(process.env.LOW_STOCK_THRESHOLD) || 10

        const lowStockProducts = await prisma.product.findMany({
            where: {
                quantity: {
                    lte: threshold,
                },
            },
            include: {
                category: true,
                itemType: true,
            },
        })

        res.json({ lowStockProducts })
    } catch (error) {
        console.error('Get low stock products error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const getSalesSummary = async (req: Request, res: Response) => {
    try {
        const { from, to } = req.query

        if (!from || !to) {
            return res.status(400).json({ error: 'From and to dates are required' })
        }

        const fromDate = new Date(from as string)
        const toDate = new Date(to as string)
        toDate.setHours(23, 59, 59, 999)

        const sales = await prisma.sale.findMany({
            where: {
                createdAt: {
                    gte: fromDate,
                    lte: toDate,
                },
            },
        })

        const totalSales = sales.length
        const totalRevenue = sales.reduce((sum: number, sale: any) => sum + Number(sale.total), 0)

        res.json({
            summary: {
                totalSales,
                totalRevenue,
            },
            sales,
        })
    } catch (error) {
        console.error('Get sales summary error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}
