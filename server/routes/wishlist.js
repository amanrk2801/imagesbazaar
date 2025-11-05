const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Wishlist = require('../models/Wishlist');
const Image = require('../models/Image');

// Add to wishlist
router.post('/add/:imageId', auth, async (req, res) => {
  try {
    const { imageId } = req.params;

    // Check if image exists
    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Check if already in wishlist
    const existing = await Wishlist.findOne({ user: req.user.id, image: imageId });
    if (existing) {
      return res.status(400).json({ message: 'Already in wishlist' });
    }

    const wishlistItem = new Wishlist({
      user: req.user.id,
      image: imageId
    });

    await wishlistItem.save();

    res.json({ message: 'Added to wishlist', inWishlist: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove from wishlist
router.delete('/remove/:imageId', auth, async (req, res) => {
  try {
    const { imageId } = req.params;

    await Wishlist.findOneAndDelete({ user: req.user.id, image: imageId });

    res.json({ message: 'Removed from wishlist', inWishlist: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's wishlist
router.get('/', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user.id })
      .populate({
        path: 'image',
        populate: { path: 'contributor', select: 'name' }
      })
      .sort({ addedAt: -1 });

    res.json(wishlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if image is in wishlist
router.get('/check/:imageId', auth, async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findOne({ 
      user: req.user.id, 
      image: req.params.imageId 
    });

    res.json({ inWishlist: !!wishlistItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
