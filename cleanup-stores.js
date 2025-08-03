const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mongodb+srv://sam:sam321123@cluster0.6psiz.mongodb.net/ecommerce"
    }
  }
});

async function cleanupStores() {
  try {
    console.log('🔍 Fetching all stores...');
    const allStores = await prisma.store.findMany();
    
    console.log('📋 Current stores in database:');
    allStores.forEach(store => {
      console.log(`- ${store.name} (ID: ${store.id})`);
    });
    
    // Find stores to keep (case-insensitive)
    const storesToKeep = allStores.filter(store => 
      store.name.toLowerCase().includes('nail') || 
      store.name.toLowerCase().includes('abaya')
    );
    
    // Find stores to delete
    const storesToDelete = allStores.filter(store => 
      !store.name.toLowerCase().includes('nail') && 
      !store.name.toLowerCase().includes('abaya')
    );
    
    console.log('\n✅ Stores to keep:');
    storesToKeep.forEach(store => {
      console.log(`- ${store.name} (ID: ${store.id})`);
    });
    
    console.log('\n❌ Stores to delete:');
    storesToDelete.forEach(store => {
      console.log(`- ${store.name} (ID: ${store.id})`);
    });
    
    if (storesToDelete.length === 0) {
      console.log('\n🎉 No stores to delete!');
      return;
    }
    
    console.log('\n🗑️  Deleting unwanted stores...');
    
    for (const store of storesToDelete) {
      try {
        // Delete related data first
        await prisma.billboard.deleteMany({
          where: { storeId: store.id }
        });
        
        await prisma.category.deleteMany({
          where: { storeId: store.id }
        });
        
        await prisma.product.deleteMany({
          where: { storeId: store.id }
        });
        
        await prisma.size.deleteMany({
          where: { storeId: store.id }
        });
        
        await prisma.color.deleteMany({
          where: { storeId: store.id }
        });
        
        await prisma.order.deleteMany({
          where: { storeId: store.id }
        });
        
        // Finally delete the store
        await prisma.store.delete({
          where: { id: store.id }
        });
        
        console.log(`✅ Deleted store: ${store.name}`);
      } catch (error) {
        console.error(`❌ Error deleting store ${store.name}:`, error.message);
      }
    }
    
    console.log('\n🎉 Cleanup completed!');
    
    // Show final results
    const finalStores = await prisma.store.findMany();
    console.log('\n📋 Remaining stores:');
    finalStores.forEach(store => {
      console.log(`- ${store.name} (ID: ${store.id})`);
    });
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
cleanupStores();
