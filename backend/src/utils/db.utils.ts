import { prisma } from '../prisma.js'

export async function checkDatabaseConnection() {
    try {
        await prisma.$queryRaw`SELECT 1`
        console.log('✅ Database connection successful')
        return true
    } catch (error) {
        console.error('❌ Database connection failed:', error)
        return false
    }
}
