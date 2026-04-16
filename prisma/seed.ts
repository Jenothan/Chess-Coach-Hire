import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // Clean up existing data
    await prisma.booking.deleteMany()
    await prisma.student.deleteMany()
    await prisma.coach.deleteMany()
    await prisma.user.deleteMany()

    // Create some users and coaches
    const coachesData = [
        {
            name: 'Grandmaster Alex',
            email: 'alex@example.com',
            coach: {
                title: 'Grandmaster (GM)',
                rating: 2800,
                stars: 4.9,
                reviewsCount: 150,
                location: 'New York, USA',
                languages: ['English', 'Russian'],
                hourlyRate: 80,
                monthlyRate: 300,
                specialties: ['Advanced Strategy', 'Positional Play'],
                experience: '15 years',
                bio: 'Former national champion with 15 years of coaching experience.',
                availability: 'Available Today'
            }
        },
        {
            name: 'Sarah Jones',
            email: 'sarah@example.com',
            coach: {
                title: 'International Master (IM)',
                rating: 2450,
                stars: 4.8,
                reviewsCount: 85,
                location: 'London, UK',
                languages: ['English', 'Spanish'],
                hourlyRate: 50,
                monthlyRate: 180,
                specialties: ['Tactics & Openings'],
                experience: '8 years',
                bio: 'Passionate about teaching juniors and intermediate players.',
                availability: 'Available Tomorrow'
            }
        },
        {
            name: 'David Chen',
            email: 'david@example.com',
            coach: {
                title: 'FIDE Master (FM)',
                rating: 2320,
                stars: 4.7,
                reviewsCount: 42,
                location: 'Toronto, Canada',
                languages: ['English', 'Mandarin'],
                hourlyRate: 35,
                monthlyRate: 120,
                specialties: ['Endgame Theory'],
                experience: '5 years',
                bio: 'Endgame specialist. I believe the endgame is where the game is truly won.',
                availability: 'Available Today'
            }
        }
    ]

    for (const data of coachesData) {
        await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                role: 'COACH',
                coachProfile: {
                    create: {
                        ...data.coach,
                        status: 'ACTIVE'
                    }
                }
            }
        })
    }

    console.log('Seeding completed successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
