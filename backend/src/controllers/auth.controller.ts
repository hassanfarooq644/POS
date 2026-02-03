import type { Request, Response } from 'express'
import { prisma } from '../prisma.js'
import { hashPassword, comparePassword, generateToken } from '../utils/auth.utils.js'
import { UserRole } from '@prisma/client'

export const register = async (req: Request, res: Response) => {
    console.log({ body: req.body })
    try {
        const { firstName, lastName, email, username, password, role, phoneNumber, address, city, state, gender } = req.body

        // Validate required fields
        if (!firstName || !lastName || !email || !username || !password) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username },
                ],
            },
        })

        if (existingUser) {
            return res.status(409).json({ error: 'User with this email or username already exists' })
        }

        // Hash password
        const hashedPassword = await hashPassword(password)

        // Create user
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                username,
                password: hashedPassword,
                role: role || UserRole.STAFF,
                phoneNumber,
                address,
                city,
                state,
                gender,
                createdBy: 'system', // TODO: In a real app, this might come from the admin creating the user
                updatedBy: 'system',
            },
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

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        })

        // Return token and user
        res.status(201).json({ user, token })
    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' })
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        // Check if user is active
        if (!user.isActive || user.isDeleted) {
            return res.status(403).json({ error: 'Account is inactive or deleted' })
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        })

        res.json({
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
                role: user.role,
                picture: user.picture,
            },
            token,
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const getMe = async (req: Request, res: Response) => {
    try {
        // req.user is set by the authenticate middleware
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                username: true,
                role: true,
                picture: true,
                // Add other fields you want to expose
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get Me error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
