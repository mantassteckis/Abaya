require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getStoreId() {
  try {
    const stores = await prisma.store.findMany();
    
    if (stores.length === 0) {
      console.log('❌ No stores found in database');
      return;
    }
    
    console.log('📊 Found stores:');
    stores.forEach((store, index) => {
      console.log(`${index + 1}. Store: "${store.name}" | ID: ${store.id}`);
    });
    
    console.log('\n🔑 Use the first store ID for checkout:');
    console.log(`Store ID: ${stores[0].id}`);
    
  } catch (error) {
    console.error('❌ Error fetching stores:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getStoreId();
