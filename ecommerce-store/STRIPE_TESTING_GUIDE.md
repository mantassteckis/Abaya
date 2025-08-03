# 🛒 Stripe Payment Gateway Testing Guide

## Overview
This guide will help you test the Stripe payment integration for your ecommerce store using your sandbox keys.

## 🔑 Your Stripe Keys (Sandbox)
- **Publishable Key**: `pk_test_51RimftRxSgSyaHC0ryBne1bJoWOOasF1iPINIaNr9dSlejA6DECbOJLVVLo7hnGyzwxl76aEIo1PLto1asa2LUtZ007KkH0KnT`
- **Secret Key**: `sk_test_51RimftRxSgSyaHC0UVV4WTn56deNy8UwZ2biMLkUcXelQ21RsTRmy61rmilMBJqE2yUDiaMuNxoEv1dAIIYnTIWp00QMVKP1EH`

## 📋 Setup Steps

### Step 1: Environment Variables
Your environment variables are already configured:

**Admin (.env.local):**
```
STRIPE_API_KEY=sk_test_51RimftRxSgSyaHC0UVV4WTn56deNy8UwZ2biMLkUcXelQ21RsTRmy61rmilMBJqE2yUDiaMuNxoEv1dAIIYnTIWp00QMVKP1EH
STRIPE_PUBLISHABLE_KEY=pk_test_51RimftRxSgSyaHC0ryBne1bJoWOOasF1iPINIaNr9dSlejA6DECbOJLVVLo7hnGyzwxl76aEIo1PLto1asa2LUtZ007KkH0KnT
```

**Store (.env.local):**
```
NEXT_PUBLIC_API_URL="http://localhost:3002/api"
```

### Step 2: Start Both Servers

1. **Start Admin Server:**
   ```bash
   cd ecommerce-admin
   npm run dev
   # Will run on http://localhost:3002
   ```

2. **Start Store Server:**
   ```bash
   cd ecommerce-store  
   npm run dev -- -p 3003
   # Will run on http://localhost:3003
   ```

### Step 3: Fix Store ID in Checkout

The checkout API expects a store ID. Update the summary component to include it:

```typescript
// In ecommerce-store/app/(routes)/cart/components/summary.tsx
const onCheckout = async () => {
  try {
    const storeId = "YOUR_STORE_ID"; // Replace with actual store ID
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/${storeId}/checkout`,
      {
        productVariants: items.map((item) => ({
          productId: item.product.id,
          variantId: item.variant.id,
        })),
        quantities: items.map((item) => item.quantity),
      }
    );
    window.location = response.data.url;
  } catch (error: any) {
    toast.error(error?.response?.data?.error || error.message);
  }
};
```

## 🧪 Testing Process

### Step 1: Add Products to Cart
1. Visit http://localhost:3003
2. Browse products and add them to cart
3. Navigate to cart page

### Step 2: Test Checkout
1. Click "Checkout" button
2. You'll be redirected to Stripe Checkout
3. Use test card numbers:

**Success Cases:**
- `4242 4242 4242 4242` (Visa)
- `5555 5555 5555 4444` (Mastercard)
- `3782 822463 10005` (American Express)

**Error Cases:**
- `4000 0000 0000 0002` (Declined)
- `4000 0000 0000 9995` (Insufficient funds)
- `4000 0000 0000 0069` (Expired card)

**Test Data:**
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3-digit number (e.g., 123)
- ZIP: Any 5-digit number (e.g., 12345)

### Step 3: Test Webhooks (Optional)
1. Install Stripe CLI (already done)
2. Forward events to your webhook:
   ```bash
   stripe listen --forward-to localhost:3002/api/webhook
   ```
3. This will give you a webhook secret to update in your .env.local

## 📊 Monitoring & Debugging

### Stripe Dashboard
- Visit: https://dashboard.stripe.com/test/payments
- View all test payments and their status
- Check webhook events and logs

### Console Logs
- Check browser console for any errors
- Check terminal output for server logs
- Admin server logs webhook events

### Common Issues

1. **Network Error on Checkout:**
   - Ensure admin server is running on port 3002
   - Check store ID in checkout URL
   - Verify environment variables

2. **Webhook Not Working:**
   - Check webhook secret in .env.local
   - Ensure webhook URL is accessible
   - Test with Stripe CLI forwarding

3. **Payment Success but Order Not Updated:**
   - Check webhook events in Stripe dashboard
   - Verify database connection
   - Check order status in admin panel

## 🔧 Development Tools

### Test Webhook Locally
```bash
# Terminal 1: Start webhook forwarding
stripe listen --forward-to localhost:3002/api/webhook

# Terminal 2: Test webhook with sample event
stripe trigger payment_intent.succeeded
```

### View Stripe Logs
```bash
stripe logs tail
```

## 📈 Next Steps

1. **Go Live:**
   - Replace test keys with live keys
   - Update webhook endpoints
   - Test with small amounts first

2. **Enhanced Features:**
   - Add more payment methods
   - Implement subscription billing
   - Add payment confirmation emails

3. **Security:**
   - Implement payment intent confirmation
   - Add fraud detection
   - Enable 3D Secure for cards

## 🎯 Success Criteria

✅ Products can be added to cart  
✅ Checkout redirects to Stripe  
✅ Test payments complete successfully  
✅ Webhooks update order status  
✅ Stock levels are updated  
✅ Customer receives confirmation  

## 🚀 Ready to Test!

Your Stripe integration is now ready for testing. Start with the basic checkout flow using the test card numbers above, then move on to webhook testing and error scenarios.

Remember: This is a test environment - no real money will be charged!
