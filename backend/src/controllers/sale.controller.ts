import type { Request, Response } from 'express'
import { prisma } from '../prisma.js'

export const createSale = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user
        if (!currentUser) return res.status(401).json({ error: 'Unauthorized' })

        const { customerId, items } = req.body

        if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Invalid sale data' })
        }

        // Verify products existence and stock
        // Note: For a robust system, we should lock rows or check stock inside transaction,
        // but for now we'll do a basic check or let the transaction fail if stock goes negative (if DB constraints exist).
        // The original Next.js code likely did something similar.

        const result = await prisma.$transaction(async (tx: any) => {
            // 1. Calculate total (optional, but good for verification)
            // We'll trust the items passed but re-fetch prices to be safe.
            let totalAmount = 0
            const saleItemsData = []

            for (const item of items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId },
                })

                if (!product) {
                    throw new Error(`Product not found: ${item.productId}`)
                }

                if (product.quantity < item.quantity) {
                    throw new Error(`Insufficient stock for product: ${product.itemName}`)
                }

                totalAmount += Number(product.retailPrice) * item.quantity

                saleItemsData.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: product.retailPrice,
                })

                // 2. Decrement stock
                await tx.product.update({
                    where: { id: item.productId },
                    data: { quantity: { decrement: item.quantity } },
                })

                // 3. Create Inventory Log
                await tx.inventoryLog.create({
                    data: {
                        productId: item.productId,
                        userId: currentUser.userId,
                        quantityChange: -item.quantity,
                        reason: 'Sale',
                        createdBy: currentUser.email,
                        updatedBy: currentUser.email,
                    },
                })
            }

            // 4. Create Sale Record
            const sale = await tx.sale.create({
                data: {
                    userId: customerId, // Customer
                    total: totalAmount,
                    status: 'COMPLETED',
                    paymentMethod: 'CASH', // Default for now
                    createdBy: currentUser.email,
                    updatedBy: currentUser.email,
                    saleItems: {
                        create: saleItemsData,
                    },
                },
                include: {
                    saleItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            })

            return sale
        })

        res.status(201).json({ sale: result })
    } catch (error: any) {
        console.error('Create sale error:', error)
        res.status(500).json({ error: error.message || 'Internal server error' })
    }
}
