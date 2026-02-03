import { PrismaClient, UserRole, Gender } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...')

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            username: 'admin',
            password: adminPassword,
            role: UserRole.ADMIN,
            gender: Gender.MALE,
            phoneNumber: '(555) 000-0001',
            createdBy: 'system',
            updatedBy: 'system',
        },
    })
    console.log('✅ Created admin user')

    // Create manager user
    const managerPassword = await bcrypt.hash('manager123', 10)
    const manager = await prisma.user.upsert({
        where: { email: 'manager@example.com' },
        update: {},
        create: {
            firstName: 'Manager',
            lastName: 'User',
            email: 'manager@example.com',
            username: 'manager',
            password: managerPassword,
            role: UserRole.MANAGER,
            gender: Gender.FEMALE,
            phoneNumber: '(555) 000-0002',
            createdBy: 'system',
            updatedBy: 'system',
        },
    })
    console.log('✅ Created manager user')

    // Create staff user
    const staffPassword = await bcrypt.hash('staff123', 10)
    const staff = await prisma.user.upsert({
        where: { email: 'staff@example.com' },
        update: {},
        create: {
            firstName: 'Staff',
            lastName: 'User',
            email: 'staff@example.com',
            username: 'staff',
            password: staffPassword,
            role: UserRole.STAFF,
            gender: Gender.OTHER,
            phoneNumber: '(555) 000-0003',
            createdBy: 'system',
            updatedBy: 'system',
        },
    })
    console.log('✅ Created staff user')

    // Create sample customer
    const customerPassword = await bcrypt.hash('customer123', 10)
    const customer = await prisma.user.upsert({
        where: { email: 'customer@example.com' },
        update: {},
        create: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'customer@example.com',
            username: 'customer',
            password: customerPassword,
            role: UserRole.STAFF,
            gender: Gender.MALE,
            phoneNumber: '(555) 111-2222',
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            createdBy: 'system',
            updatedBy: 'system',
        },
    })
    console.log('✅ Created customer user')

    // Create categories
    const electronics = await prisma.category.upsert({
        where: { name: 'Electronics' },
        update: {},
        create: {
            name: 'Electronics',
            createdBy: 'system',
            updatedBy: 'system',
        },
    })

    const clothing = await prisma.category.upsert({
        where: { name: 'Clothing' },
        update: {},
        create: {
            name: 'Clothing',
            createdBy: 'system',
            updatedBy: 'system',
        },
    })

    const food = await prisma.category.upsert({
        where: { name: 'Food & Beverages' },
        update: {},
        create: {
            name: 'Food & Beverages',
            createdBy: 'system',
            updatedBy: 'system',
        },
    })
    console.log('✅ Created categories')

    // Create item types
    const retail = await prisma.itemType.upsert({
        where: { name: 'Retail' },
        update: {},
        create: {
            name: 'Retail',
            createdBy: 'system',
            updatedBy: 'system',
        },
    })

    const wholesale = await prisma.itemType.upsert({
        where: { name: 'Wholesale' },
        update: {},
        create: {
            name: 'Wholesale',
            createdBy: 'system',
            updatedBy: 'system',
        },
    })
    console.log('✅ Created item types')

    // Create sample products
    const products = [
        {
            itemName: 'Laptop Dell XPS 15',
            barcode: 'DELL-XPS-001',
            quantity: 25,
            company: 'Dell',
            wholesalePrice: 1200,
            retailPrice: 1599,
            description: 'High-performance laptop with 15.6" display',
            shortDescription: 'Dell XPS 15 Laptop',
            tax: 8.5,
            categoryId: electronics.id,
            itemTypeId: retail.id,
        },
        {
            itemName: 'iPhone 15 Pro',
            barcode: 'APPLE-IP15-001',
            quantity: 50,
            company: 'Apple',
            wholesalePrice: 900,
            retailPrice: 1199,
            description: 'Latest iPhone with A17 Pro chip',
            shortDescription: 'iPhone 15 Pro',
            tax: 8.5,
            categoryId: electronics.id,
            itemTypeId: retail.id,
        },
        {
            itemName: 'Wireless Mouse',
            barcode: 'LOGIT-MX3-001',
            quantity: 8,
            company: 'Logitech',
            wholesalePrice: 35,
            retailPrice: 59.99,
            description: 'Ergonomic wireless mouse',
            shortDescription: 'Logitech MX Master 3',
            tax: 8.5,
            categoryId: electronics.id,
            itemTypeId: retail.id,
        },
        {
            itemName: 'Cotton T-Shirt',
            barcode: 'CLOTH-TS-001',
            quantity: 100,
            company: 'Generic',
            wholesalePrice: 8,
            retailPrice: 19.99,
            description: '100% cotton comfortable t-shirt',
            shortDescription: 'Cotton T-Shirt',
            tax: 6,
            categoryId: clothing.id,
            itemTypeId: wholesale.id,
        },
        {
            itemName: 'Coffee Beans 1kg',
            barcode: 'FOOD-CF-001',
            quantity: 5,
            company: 'Starbucks',
            wholesalePrice: 12,
            retailPrice: 24.99,
            description: 'Premium Arabica coffee beans',
            shortDescription: 'Coffee Beans',
            tax: 3,
            categoryId: food.id,
            itemTypeId: retail.id,
        },
    ]

    for (const productData of products) {
        const product = await prisma.product.create({
            data: {
                ...productData,
                createdBy: 'system',
                updatedBy: 'system',
            },
        })

        // Create initial inventory log
        await prisma.inventoryLog.create({
            data: {
                quantityChange: productData.quantity,
                reason: 'Initial Stock',
                productId: product.id,
                userId: admin.id,
                createdBy: 'system',
                updatedBy: 'system',
            },
        })
    }
    console.log('✅ Created sample products with inventory logs')

    // Create a sample sale
    const saleProducts = await prisma.product.findMany({
        take: 2,
    })

    const totalAmount = saleProducts.reduce(
        (sum, p) => sum + parseFloat(p.retailPrice.toString()),
        0
    )

    const sale = await prisma.sale.create({
        data: {
            totalAmount,
            customerId: customer.id,
            staffId: staff.id,
            createdBy: 'system',
            updatedBy: 'system',
        },
    })

    for (const product of saleProducts) {
        await prisma.saleItem.create({
            data: {
                saleId: sale.id,
                productId: product.id,
                quantitySold: 1,
                priceAtSale: product.retailPrice,
                createdBy: 'system',
                updatedBy: 'system',
            },
        })

        await prisma.product.update({
            where: { id: product.id },
            data: { quantity: { decrement: 1 } },
        })

        await prisma.inventoryLog.create({
            data: {
                quantityChange: -1,
                reason: `Sale #${sale.id}`,
                productId: product.id,
                userId: staff.id,
                createdBy: 'system',
                updatedBy: 'system',
            },
        })
    }
    console.log('✅ Created sample sale transaction')

    console.log('🎉 Database seed completed!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
