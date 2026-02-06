import { jwtVerify } from 'jose'
export interface JWTPayload {
    userId: string
    email: string
    role: string
    exp: number
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'

export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const secret = new TextEncoder().encode(JWT_SECRET)
        const { payload } = await jwtVerify(token, secret)
        return payload as unknown as JWTPayload
    } catch (error) {
        return null
    }
}
