import type { Request, Response } from 'express'
import { prisma } from '../prisma.js'

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                username: true,
                role: true,
                picture: true,
            },
        })

        res.json({ users })
    } catch (error) {
        console.error('Get users error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}
