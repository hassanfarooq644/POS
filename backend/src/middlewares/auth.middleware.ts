import type { Request, Response, NextFunction } from 'express'
import { verifyToken, type JWTPayload } from '../utils/auth.utils.js'

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    // Get token from header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' })
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' })
    }

    const decoded = verifyToken(token)

    if (!decoded) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' })
    }

    req.user = decoded
    next()
}

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' })
        }

        next()
    }
}
