const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: true },
  addedAt: { type: Date, default: Date.now }
});

// Ensure a user can only add an image once to wishlist
wishlistSchema.index({ user: 1, image: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
