import type { Request, Response } from 'express'
import { prisma } from '../prisma.js'

export const getProducts = async (req: Request, res: Response) => {
    try {
        const { search } = req.query

        const products = await prisma.product.findMany({
            where: {
                ...(search && {
                    OR: [
                        { itemName: { contains: search as string, mode: 'insensitive' } },
                        { barcode: { contains: search as string, mode: 'insensitive' } },
                        { company: { contains: search as string, mode: 'insensitive' } },
                    ],
                }),
            },
            include: {
                category: true,
                itemType: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        res.json({ products })
    } catch (error) {
        console.error('Get products error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const createProduct = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user

        if (!currentUser) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        const {
            itemName,
            barcode,
            quantity,
            company,
            wholesalePrice,
            retailPrice,
            description,
            shortDescription,
            picture,
            tax,
            categoryId,
            itemTypeId,
        } = req.body

        // Validate required fields
        if (!itemName || !barcode || !categoryId || !itemTypeId || wholesalePrice == null || retailPrice == null) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        // Check if barcode already exists
        const existingProduct = await prisma.product.findUnique({
            where: { barcode },
        })

        if (existingProduct) {
            return res.status(409).json({ error: 'Product with this barcode already exists' })
        }

        // Create product and initial inventory log in a transaction
        const product = await prisma.$transaction(async (tx: any) => {
            const newProduct = await tx.product.create({
                data: {
                    itemName,
                    barcode,
                    quantity: quantity || 0,
                    company,
                    wholesalePrice,
                    retailPrice,
                    description,
                    shortDescription,
                    picture,
                    tax: tax || 0,
                    categoryId,
                    itemTypeId,
                    createdBy: currentUser.email,
                    updatedBy: currentUser.email,
                },
                include: {
                    category: true,
                    itemType: true,
                },
            })

            // Create initial inventory log if quantity > 0
            if (quantity && quantity > 0) {
                await tx.inventoryLog.create({
                    data: {
                        quantityChange: quantity,
                        reason: 'Initial Stock',
                        productId: newProduct.id,
                        userId: currentUser.userId,
                        createdBy: currentUser.email,
                        updatedBy: currentUser.email,
                    },
                })
            }

            return newProduct
        })

        res.status(201).json({ product })
    } catch (error) {
        console.error('Create product error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const product = await prisma.product.findUnique({
            where: { id: id as string },
            include: {
                category: true,
                itemType: true,
            },
        })

        if (!product) {
            return res.status(404).json({ error: 'Product not found' })
        }

        res.json({ product })
    } catch (error) {
        console.error('Get product error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user
        if (!currentUser) return res.status(401).json({ error: 'Unauthorized' })

        const { id } = req.params
        const {
            itemName,
            barcode,
            quantity,
            company,
            wholesalePrice,
            retailPrice,
            description,
            shortDescription,
            picture,
            tax,
            categoryId,
            itemTypeId,
        } = req.body

        const existingProduct = await prisma.product.findUnique({
            where: { id: id as string },
        })

        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' })
        }

        const product = await prisma.$transaction(async (tx: any) => {
            const updatedProduct = await tx.product.update({
                where: { id: id as string },
                data: {
                    itemName,
                    barcode,
                    quantity,
                    company,
                    wholesalePrice,
                    retailPrice,
                    description,
                    shortDescription,
                    picture,
                    tax,
                    categoryId,
                    itemTypeId,
                    updatedBy: currentUser.email,
                },
                include: {
                    category: true,
                    itemType: true,
                },
            })

            if (quantity != null && quantity !== existingProduct.quantity) {
                const quantityChange = quantity - existingProduct.quantity
                await tx.inventoryLog.create({
                    data: {
                        quantityChange,
                        reason: 'Manual Correction',
                        productId: id,
                        userId: currentUser.userId,
                        createdBy: currentUser.email,
                        updatedBy: currentUser.email,
                    },
                })
            }

            return updatedProduct
        })

        res.json({ product })
    } catch (error) {
        console.error('Update product error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        await prisma.product.delete({
            where: { id: id as string },
        })

        res.json({ message: 'Product deleted successfully' })
    } catch (error) {
        console.error('Delete product error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}
