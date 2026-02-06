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

        const body = req.body || {}
        const {
            itemName,
            barcode,
            quantity,
            company,
            wholesalePrice,
            retailPrice,
            description,
            shortDescription,
            tax,
            categoryId,
            itemTypeId,
        } = body

        // Proper validation messages as requested
        const errors: string[] = []
        if (!itemName) errors.push('Product name is required')
        if (!barcode) errors.push('Barcode is required')
        if (!categoryId) errors.push('Category is required')
        if (!itemTypeId) errors.push('Item type is required')
        if (wholesalePrice === undefined || wholesalePrice === '') errors.push('Wholesale price is required')
        if (retailPrice === undefined || retailPrice === '') errors.push('Retail price is required')

        if (errors.length > 0) {
            return res.status(400).json({ error: errors[0], details: errors })
        }

        const picture = req.file ? `/assets/product-images/${req.file.filename}` : body.picture

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
                    quantity: parseInt(quantity?.toString() || '0'),
                    company,
                    wholesalePrice: parseFloat(wholesalePrice.toString()),
                    retailPrice: parseFloat(retailPrice.toString()),
                    description,
                    shortDescription,
                    picture,
                    tax: parseFloat(tax?.toString() || '0'),
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
            const q = parseInt(quantity?.toString() || '0')
            if (q > 0) {
                await tx.inventoryLog.create({
                    data: {
                        quantityChange: q,
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
        const body = req.body || {}
        const {
            itemName,
            barcode,
            quantity,
            company,
            wholesalePrice,
            retailPrice,
            description,
            shortDescription,
            tax,
            categoryId,
            itemTypeId,
        } = body

        const picture = req.file ? `/assets/product-images/${req.file.filename}` : body.picture

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
                    quantity: quantity != null ? parseInt(quantity.toString()) : undefined,
                    company,
                    wholesalePrice: wholesalePrice != null ? parseFloat(wholesalePrice.toString()) : undefined,
                    retailPrice: retailPrice != null ? parseFloat(retailPrice.toString()) : undefined,
                    description,
                    shortDescription,
                    picture,
                    tax: tax != null ? parseFloat(tax.toString()) : undefined,
                    categoryId,
                    itemTypeId,
                    updatedBy: currentUser.email,
                },
                include: {
                    category: true,
                    itemType: true,
                },
            })

            if (quantity != null) {
                const q = parseInt(quantity.toString())
                if (q !== existingProduct.quantity) {
                    const quantityChange = q - existingProduct.quantity
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
