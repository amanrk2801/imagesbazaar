const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Payout = require('../models/Payout');
const Purchase = require('../models/Purchase');
const User = require('../models/User');

// Get contributor's available balance
router.get('/balance', auth, async (req, res) => {
  try {
    // Calculate total earnings
    const purchases = await Purchase.find({ 
      contributor: req.user.id, 
      status: 'completed' 
    });
    const totalEarnings = purchases.reduce((sum, p) => sum + p.contributorEarning, 0);

    // Calculate total withdrawn
    const payouts = await Payout.find({ 
      contributor: req.user.id, 
      status: { $in: ['completed', 'processing'] }
    });
    const totalWithdrawn = payouts.reduce((sum, p) => sum + p.amount, 0);

    // Calculate pending payouts
    const pendingPayouts = await Payout.find({ 
      contributor: req.user.id, 
      status: 'pending'
    });
    const pendingAmount = pendingPayouts.reduce((sum, p) => sum + p.amount, 0);

    const availableBalance = totalEarnings - totalWithdrawn - pendingAmount;

    res.json({
      totalEarnings,
      totalWithdrawn,
      pendingAmount,
      availableBalance
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Request payout
router.post('/request', auth, async (req, res) => {
  try {
    const { amount, method, bankDetails } = req.body;

    // Validate amount
    if (!amount || amount < 500) {
      return res.status(400).json({ message: 'Minimum payout amount is ₹500' });
    }

    // Check available balance
    const purchases = await Purchase.find({ 
      contributor: req.user.id, 
      status: 'completed' 
    });
    const totalEarnings = purchases.reduce((sum, p) => sum + p.contributorEarning, 0);

    const payouts = await Payout.find({ 
      contributor: req.user.id, 
      status: { $in: ['completed', 'processing', 'pending'] }
    });
    const totalRequested = payouts.reduce((sum, p) => sum + p.amount, 0);

    const availableBalance = totalEarnings - totalRequested;

    if (amount > availableBalance) {
      return res.status(400).json({ 
        message: `Insufficient balance. Available: ₹${availableBalance.toFixed(2)}` 
      });
    }

    // Validate bank details
    if (method === 'bank') {
      if (!bankDetails.accountHolderName || !bankDetails.accountNumber || !bankDetails.ifscCode) {
        return res.status(400).json({ message: 'Please provide complete bank details' });
      }
    } else if (method === 'upi') {
      if (!bankDetails.upiId) {
        return res.status(400).json({ message: 'Please provide UPI ID' });
      }
    }

    // Create payout request
    const payout = new Payout({
      contributor: req.user.id,
      amount,
      method,
      bankDetails,
      status: 'pending'
    });

    await payout.save();

    res.json({ 
      message: 'Payout request submitted successfully',
      payout: {
        id: payout._id,
        amount: payout.amount,
        method: payout.method,
        status: payout.status,
        requestedAt: payout.requestedAt
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to submit payout request' });
  }
});

// Get payout history
router.get('/history', auth, async (req, res) => {
  try {
    const payouts = await Payout.find({ contributor: req.user.id })
      .sort({ requestedAt: -1 });

    res.json(payouts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel pending payout
router.delete('/:id', auth, async (req, res) => {
  try {
    const payout = await Payout.findOne({ 
      _id: req.params.id, 
      contributor: req.user.id 
    });

    if (!payout) {
      return res.status(404).json({ message: 'Payout not found' });
    }

    if (payout.status !== 'pending') {
      return res.status(400).json({ message: 'Can only cancel pending payouts' });
    }

    payout.status = 'cancelled';
    await payout.save();

    res.json({ message: 'Payout cancelled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to cancel payout' });
  }
});

module.exports = router;
