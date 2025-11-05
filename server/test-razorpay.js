// Test script to verify Razorpay configuration
require('dotenv').config();
const Razorpay = require('razorpay');

console.log('=== Testing Razorpay Configuration ===\n');

console.log('1. Checking environment variables:');
console.log('   RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID || 'NOT FOUND');
console.log('   RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? '***' + process.env.RAZORPAY_KEY_SECRET.slice(-4) : 'NOT FOUND');

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('\n❌ ERROR: Razorpay credentials not found!');
  console.error('Please check your server/.env file has:');
  console.error('RAZORPAY_KEY_ID=rzp_test_Rc0m1fZQ181lnd');
  console.error('RAZORPAY_KEY_SECRET=wxj37aLseJqkIf4O3uh1PUVI');
  process.exit(1);
}

console.log('\n2. Creating Razorpay instance...');
try {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
  console.log('   ✓ Razorpay instance created successfully');

  console.log('\n3. Testing order creation...');
  razorpay.orders.create({
    amount: 10000, // ₹100 in paise
    currency: 'INR',
    receipt: 'test_receipt_' + Date.now()
  })
  .then(order => {
    console.log('   ✓ Test order created successfully!');
    console.log('   Order ID:', order.id);
    console.log('   Amount:', order.amount / 100, 'INR');
    console.log('\n✅ Razorpay is configured correctly!');
    console.log('You can now use the payment system.\n');
  })
  .catch(err => {
    console.error('   ❌ Order creation failed:', err.message);
    console.error('\nPossible issues:');
    console.error('- Invalid API keys');
    console.error('- Network connection problem');
    console.error('- Razorpay service down');
    console.error('\nFull error:', err);
  });

} catch (err) {
  console.error('   ❌ Failed to create Razorpay instance:', err.message);
  console.error('\nFull error:', err);
}
