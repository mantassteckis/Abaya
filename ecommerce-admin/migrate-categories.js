const { PrismaClient } = require('@prisma/client');

// Make sure to use the correct schema path
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log('Starting migration: Adding isActive field to existing categories...');
  
  try {
    // Get all categories that might not have isActive field
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        isActive: true
      }
    });

    console.log(`Found ${categories.length} categories to check`);

    // Since MongoDB doesn't handle null/undefined checks well, let's update all categories
    // to ensure they have the isActive field set to true (existing behavior)
    const updateResult = await prisma.category.updateMany({
      data: {
        isActive: true
      }
    });

    console.log(`Updated ${updateResult.count} categories to set isActive: true`);
    
    console.log('Migration completed successfully!');
    
    // Verify the results
    const verifyCategories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        isActive: true
      }
    });

    console.log('\nVerification results:');
    verifyCategories.forEach(cat => {
      console.log(`- ${cat.name}: ${cat.isActive ? 'Active' : 'Inactive'}`);
    });

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
