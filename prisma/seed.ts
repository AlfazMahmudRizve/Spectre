import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seed script is disabled as data is managed in Supabase now.')
    /* 
    // Data has been migrated to the database.
    // If you need to re-seed, restore the data array here.
    */
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
