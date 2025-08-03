// Test script to verify Stripe connection
const Stripe = require('stripe');

// Use your test secret key
const stripe = new Stripe('sk_test_51RimftRxSgSyaHC0UVV4WTn56deNy8UwZ2biMLkUcXelQ21RsTRmy61rmilMBJqE2yUDiaMuNxoEv1dAIIYnTIWp00QMVKP1EH', {
  apiVersion: '2022-11-15',
});

async function testStripeConnection() {
  try {
    // Test 1: Create a test customer
    console.log('🔍 Testing Stripe connection...');
    const customer = await stripe.customers.create({
      email: 'test@example.com',
      name: 'Test Customer'
    });
    console.log('✅ Customer created:', customer.id);

    // Test 2: Create a test product
    const product = await stripe.products.create({
      name: 'Test Product',
      description: 'A test product for payment gateway testing'
    });
    console.log('✅ Product created:', product.id);

    // Test 3: Create a test price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 2000, // $20.00
      currency: 'usd'
    });
    console.log('✅ Price created:', price.id);

    // Test 4: Create a test checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: price.id,
        quantity: 1
      }],
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel'
    });
    console.log('✅ Checkout session created:', session.id);
    console.log('🔗 Test payment URL:', session.url);

    // Clean up test data
    await stripe.products.del(product.id);
    await stripe.customers.del(customer.id);
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All tests passed! Your Stripe integration is working correctly.');
    console.log('\n📋 Test Results:');
    console.log('   - API Connection: ✅ Success');
    console.log('   - Customer Creation: ✅ Success');
    console.log('   - Product Creation: ✅ Success');
    console.log('   - Price Creation: ✅ Success');
    console.log('   - Checkout Session: ✅ Success');
    console.log('\n🔑 Your Stripe test environment is ready!');
    
  } catch (error) {
    console.error('❌ Error testing Stripe:', error.message);
    console.error('   Make sure your API keys are correct and you have internet connection.');
  }
}

testStripeConnection();
