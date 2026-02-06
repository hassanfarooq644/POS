import type { Request, Response } from 'express'
import { prisma } from '../prisma.js'

export const getItemTypes = async (req: Request, res: Response) => {
    try {
        const { search } = req.query

        const itemTypes = await prisma.itemType.findMany({
            where: {
                ...(search && {
                    OR: [
                        { name: { contains: search as string, mode: 'insensitive' } },
                    ],
                }),
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        res.json({ itemTypes })
    } catch (error) {
        console.error('Get item types error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const createItemType = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user

        if (!currentUser) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        const { name } = req.body

        if (!name) {
            return res.status(400).json({ error: 'Item type name is required' })
        }

        // Check if item type already exists
        const existingItemType = await prisma.itemType.findUnique({
            where: { name },
        })

        if (existingItemType) {
            return res.status(409).json({ error: 'Item type with this name already exists' })
        }

        const itemType = await prisma.itemType.create({
            data: {
                name,
                createdBy: currentUser.email,
                updatedBy: currentUser.email,
            },
        })

        res.status(201).json({ itemType })
    } catch (error) {
        console.error('Create item type error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const getItemTypeById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const itemType = await prisma.itemType.findUnique({
            where: { id: id as string },
            include: {
                products: true,
            },
        })

        if (!itemType) {
            return res.status(404).json({ error: 'Item type not found' })
        }

        res.json({ itemType })
    } catch (error) {
        console.error('Get item type error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const updateItemType = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user
        if (!currentUser) return res.status(401).json({ error: 'Unauthorized' })

        const { id } = req.params
        const { name } = req.body

        const existingItemType = await prisma.itemType.findUnique({
            where: { id: id as string },
        })

        if (!existingItemType) {
            return res.status(404).json({ error: 'Item type not found' })
        }

        // If name is changing, check for uniqueness
        if (name && name !== existingItemType.name) {
            const duplicateItemType = await prisma.itemType.findUnique({
                where: { name },
            })
            if (duplicateItemType) {
                return res.status(409).json({ error: 'Item type with this name already exists' })
            }
        }

        const itemType = await prisma.itemType.update({
            where: { id: id as string },
            data: {
                name,
                updatedBy: currentUser.email,
            },
        })

        res.json({ itemType })
    } catch (error) {
        console.error('Update item type error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const deleteItemType = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        // Check if item type has products before deleting (optional/policy dependent)
        const productsCount = await prisma.product.count({
            where: { itemTypeId: id as string },
        })

        if (productsCount > 0) {
            return res.status(400).json({ error: 'Cannot delete item type with associated products' })
        }

        await prisma.itemType.delete({
            where: { id: id as string },
        })

        res.json({ message: 'Item type deleted successfully' })
    } catch (error) {
        console.error('Delete item type error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

