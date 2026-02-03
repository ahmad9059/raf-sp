import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    // Update the MNSUAM department
    const updated = await prisma.department.update({
      where: {
        id: 'mnsuam',
      },
      data: {
        focalPerson: 'MNSUAM Focal Person',
        designation: '',
        phone: '',
        email: 'estatedata.focalperson@mnsuam.edu.pk',
      },
    });

    console.log('Successfully updated MNSUAM department:', updated);
  } catch (error) {
    console.error('Error updating MNSUAM department:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
