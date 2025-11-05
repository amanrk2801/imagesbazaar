const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: true },
  contributor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  commission: { type: Number, default: 0 },
  contributorEarning: { type: Number, required: true },
  paymentIntentId: String,
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'completed' },
  purchasedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Purchase', purchaseSchema);
