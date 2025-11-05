const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
  contributor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['bank', 'upi'], default: 'bank' },
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    upiId: String
  },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'], 
    default: 'pending' 
  },
  transactionId: String,
  notes: String,
  requestedAt: { type: Date, default: Date.now },
  processedAt: Date,
  completedAt: Date
});

module.exports = mongoose.model('Payout', payoutSchema);
