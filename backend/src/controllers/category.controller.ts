import type { Request, Response } from 'express'
import { prisma } from '../prisma.js'

export const getCategories = async (req: Request, res: Response) => {
    try {
        const { search } = req.query

        const categories = await prisma.category.findMany({
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

        res.json({ categories })
    } catch (error) {
        console.error('Get categories error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const createCategory = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user

        if (!currentUser) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        const { name } = req.body

        if (!name) {
            return res.status(400).json({ error: 'Category name is required' })
        }

        // Check if category already exists
        const existingCategory = await prisma.category.findUnique({
            where: { name },
        })

        if (existingCategory) {
            return res.status(409).json({ error: 'Category with this name already exists' })
        }

        const category = await prisma.category.create({
            data: {
                name,
                createdBy: currentUser.email,
                updatedBy: currentUser.email,
            },
        })

        res.status(201).json({ category })
    } catch (error) {
        console.error('Create category error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const category = await prisma.category.findUnique({
            where: { id: id as string },
            include: {
                products: true,
            },
        })

        if (!category) {
            return res.status(404).json({ error: 'Category not found' })
        }

        res.json({ category })
    } catch (error) {
        console.error('Get category error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user
        if (!currentUser) return res.status(401).json({ error: 'Unauthorized' })

        const { id } = req.params
        const { name } = req.body

        const existingCategory = await prisma.category.findUnique({
            where: { id: id as string },
        })

        if (!existingCategory) {
            return res.status(404).json({ error: 'Category not found' })
        }

        // If name is changing, check for uniqueness
        if (name && name !== existingCategory.name) {
            const duplicateCategory = await prisma.category.findUnique({
                where: { name },
            })
            if (duplicateCategory) {
                return res.status(409).json({ error: 'Category with this name already exists' })
            }
        }

        const category = await prisma.category.update({
            where: { id: id as string },
            data: {
                name,
                updatedBy: currentUser.email,
            },
        })

        res.json({ category })
    } catch (error) {
        console.error('Update category error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        // Check if category has products before deleting (optional/policy dependent)
        const productsCount = await prisma.product.count({
            where: { categoryId: id as string },
        })

        if (productsCount > 0) {
            return res.status(400).json({ error: 'Cannot delete category with associated products' })
        }

        await prisma.category.delete({
            where: { id: id as string },
        })

        res.json({ message: 'Category deleted successfully' })
    } catch (error) {
        console.error('Delete category error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

