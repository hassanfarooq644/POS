
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verify() {
    const users = await prisma.user.count()
    const categories = await prisma.category.count()
    const products = await prisma.product.count()
    const sales = await prisma.sale.count()

    console.log(`Users: ${users}`)
    console.log(`Categories: ${categories}`)
    console.log(`Products: ${products}`)
    console.log(`Sales: ${sales}`)
}

verify()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
