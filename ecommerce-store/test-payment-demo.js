#!/usr/bin/env node

const chalk = require('chalk');
const { spawn } = require('child_process');

console.log(chalk.blue.bold('🚀 Stripe Payment Gateway Testing Demo'));
console.log(chalk.gray('=====================================\n'));

console.log(chalk.green('✅ Your Stripe Integration is configured with:'));
console.log(chalk.cyan('   📦 Admin Server: http://localhost:3002'));
console.log(chalk.cyan('   🛍️  Store Frontend: http://localhost:3003'));
console.log(chalk.cyan('   🔑 Stripe Test Keys: Configured'));
console.log(chalk.cyan('   🏪 Store ID: 6805036219e37a55ea8551b6'));

console.log(chalk.yellow('\n🧪 Test Process:'));
console.log('1. Start both servers (admin & store)');
console.log('2. Visit http://localhost:3003');
console.log('3. Add products to cart');
console.log('4. Click checkout');
console.log('5. Use test card: 4242 4242 4242 4242');
console.log('6. Complete payment');

console.log(chalk.yellow('\n💳 Test Card Numbers:'));
console.log(chalk.green('   Success: 4242 4242 4242 4242'));
console.log(chalk.red('   Declined: 4000 0000 0000 0002'));
console.log(chalk.orange('   Insufficient: 4000 0000 0000 9995'));

console.log(chalk.yellow('\n🔧 Required Data:'));
console.log('   Expiry: Any future date (e.g., 12/25)');
console.log('   CVC: Any 3-digit number (e.g., 123)');
console.log('   ZIP: Any 5-digit number (e.g., 12345)');

console.log(chalk.yellow('\n📊 Monitoring:'));
console.log('   Dashboard: https://dashboard.stripe.com/test/payments');
console.log('   Webhooks: https://dashboard.stripe.com/test/webhooks');

console.log(chalk.magenta('\n🎯 Next Steps:'));
console.log('1. Test the basic payment flow');
console.log('2. Setup webhook testing (optional)');
console.log('3. Monitor payments in Stripe Dashboard');
console.log('4. Test error scenarios');

console.log(chalk.blue.bold('\n🚀 Your payment gateway is ready to test!'));
console.log(chalk.gray('Run the servers and visit the store to start testing.'));

// Test API connection
const testStripeConnection = async () => {
  console.log(chalk.yellow('\n🔍 Testing Stripe API Connection...'));
  
  try {
    const { spawn } = require('child_process');
    const testProcess = spawn('node', ['test-stripe.js'], { 
      cwd: '/Users/muhammadmuslim/Downloads/ecommerce-project-revive-working-frontend/ecommerce-admin',
      stdio: 'inherit'
    });
    
    testProcess.on('close', (code) => {
      if (code === 0) {
        console.log(chalk.green('✅ Stripe API connection successful!'));
      } else {
        console.log(chalk.red('❌ Stripe API connection failed'));
      }
    });
    
  } catch (error) {
    console.log(chalk.red('❌ Error testing Stripe connection'));
  }
};

// Run the test
testStripeConnection();
