const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const Image = require('../models/Image');
const Purchase = require('../models/Purchase');

// Debug: Check if environment variables are loaded
console.log('=== Razorpay Configuration ===');
console.log('Key ID:', process.env.RAZORPAY_KEY_ID ? 'Loaded ✓' : 'Missing ✗');
console.log('Key Secret:', process.env.RAZORPAY_KEY_SECRET ? 'Loaded ✓' : 'Missing ✗');

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('ERROR: Razorpay credentials not found in environment variables!');
  console.error('Please check your server/.env file');
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

console.log('Razorpay instance created successfully');
console.log('==============================\n');

// Create Razorpay order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { imageId } = req.body;
    
    console.log('Creating order for image:', imageId);
    console.log('User:', req.user.id);
    
    const image = await Image.findById(imageId).populate('contributor');
    if (!image) {
      console.log('Image not found');
      return res.status(404).json({ message: 'Image not found' });
    }

    console.log('Image found:', image.title, 'Price:', image.price);

    if (image.price === 0) {
      return res.status(400).json({ message: 'This image is free' });
    }

    // Check if already purchased
    const existingPurchase = await Purchase.findOne({ 
      buyer: req.user.id, 
      image: imageId,
      status: 'completed'
    });

    if (existingPurchase) {
      console.log('User already owns this image');
      return res.status(400).json({ message: 'You already own this image' });
    }

    const options = {
      amount: image.price * 100, // amount in paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`, // Shortened to fit 40 char limit
      notes: {
        imageId: imageId,
        userId: req.user.id,
        imageTitle: image.title
      }
    };

    console.log('Creating Razorpay order with options:', options);
    console.log('Razorpay Key ID being used:', process.env.RAZORPAY_KEY_ID);
    
    if (!razorpay || !razorpay.orders) {
      throw new Error('Razorpay instance not properly initialized');
    }
    
    const order = await razorpay.orders.create(options);
    console.log('Order created successfully:', order.id);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (err) {
    console.error('=== ORDER CREATION ERROR ===');
    console.error('Error type:', typeof err);
    console.error('Error message:', err.message);
    console.error('Error description:', err.description);
    console.error('Error code:', err.code);
    console.error('Full error object:', JSON.stringify(err, null, 2));
    console.error('Error stack:', err.stack);
    console.error('========================');
    
    const errorMessage = err.message || err.description || err.error?.description || 'Unknown error occurred';
    res.status(500).json({ 
      message: 'Order creation failed: ' + errorMessage,
      error: err.message,
      details: err.description || err.error?.description
    });
  }
});

// Verify payment and complete purchase
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const { imageId, orderId, paymentId, signature } = req.body;
    
    console.log('Verifying payment...');
    console.log('Order ID:', orderId);
    console.log('Payment ID:', paymentId);
    console.log('Signature:', signature);
    
    // Verify signature
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    console.log('Expected signature:', expectedSignature);

    if (expectedSignature !== signature) {
      console.log('Signature mismatch!');
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    console.log('Signature verified successfully');

    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const commission = image.price * 0.2;
    const contributorEarning = image.price - commission;

    const purchase = new Purchase({
      buyer: req.user.id,
      image: imageId,
      contributor: image.contributor,
      amount: image.price,
      commission,
      contributorEarning,
      paymentIntentId: paymentId,
      status: 'completed'
    });

    await purchase.save();
    console.log('Purchase record created:', purchase._id);

    image.downloads += 1;
    await image.save();
    console.log('Image downloads incremented');

    res.json({ 
      message: 'Purchase successful', 
      purchase: {
        id: purchase._id,
        amount: purchase.amount,
        imageTitle: image.title
      }
    });
  } catch (err) {
    console.error('Payment verification error:', err);
    res.status(500).json({ message: 'Payment verification failed: ' + err.message });
  }
});

// Get user purchases
router.get('/my-purchases', auth, async (req, res) => {
  try {
    const purchases = await Purchase.find({ buyer: req.user.id })
      .populate('image')
      .populate('contributor', 'name')
      .sort({ purchasedAt: -1 });
    
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get contributor earnings
router.get('/my-earnings', auth, async (req, res) => {
  try {
    const earnings = await Purchase.find({ contributor: req.user.id, status: 'completed' })
      .populate('image', 'title')
      .populate('buyer', 'name')
      .sort({ purchasedAt: -1 });

    const totalEarnings = earnings.reduce((sum, e) => sum + e.contributorEarning, 0);
    
    res.json({ earnings, totalEarnings });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if user owns image
router.get('/check-ownership/:imageId', auth, async (req, res) => {
  try {
    const purchase = await Purchase.findOne({
      buyer: req.user.id,
      image: req.params.imageId,
      status: 'completed'
    });

    res.json({ owned: !!purchase });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
