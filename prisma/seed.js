const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://postgres:postgres@localhost:5432/chessDB?schema=public"
        }
    }
});

async function main() {
    try {
        console.log('SEED_START');
        const userCount = await prisma.user.count();
        console.log('CURRENT_USER_COUNT:', userCount);

        // Simple create
        await prisma.user.create({
            data: {
                name: 'Seed Test',
                email: 'seed-' + Date.now() + '@example.com',
                role: 'COACH'
            }
        });

        console.log('SEED_SUCCESS');
    } catch (err) {
        console.log('SEED_ERROR_START');
        console.log(err.message);
        if (err.code) console.log('CODE:', err.code);
        console.log('SEED_ERROR_END');
    } finally {
        await prisma.$disconnect();
    }
}

main();
