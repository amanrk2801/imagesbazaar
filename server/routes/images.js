const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Image = require('../models/Image');
const Purchase = require('../models/Purchase');
const auth = require('../middleware/auth');

// Multer config
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Get all images
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (category) query.category = category;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];

    const images = await Image.find(query)
      .populate('contributor', 'name')
      .populate('category', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Image.countDocuments(query);

    res.json({ images, totalPages: Math.ceil(count / limit), currentPage: page });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single image
router.get('/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id)
      .populate('contributor', 'name email')
      .populate('category', 'name');
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    res.json(image);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload image
router.post('/', [auth, upload.single('image')], async (req, res) => {
  try {
    const { title, description, category, tags, price } = req.body;
    
    const image = new Image({
      title,
      description,
      imageUrl: `/uploads/${req.file.filename}`,
      thumbnailUrl: `/uploads/${req.file.filename}`,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      price: price || 0,
      contributor: req.user.id
    });

    await image.save();
    res.json(image);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Download image
router.post('/:id/download', auth, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    image.downloads += 1;
    await image.save();
    
    res.json({ message: 'Download counted', imageUrl: image.imageUrl });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Like image
router.post('/:id/like', auth, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Initialize likedBy array if it doesn't exist
    if (!image.likedBy) {
      image.likedBy = [];
    }

    const userIndex = image.likedBy.indexOf(req.user.id);
    
    if (userIndex > -1) {
      // User already liked, so unlike
      image.likedBy.splice(userIndex, 1);
      image.likes = Math.max(0, image.likes - 1);
    } else {
      // Add like
      image.likedBy.push(req.user.id);
      image.likes += 1;
    }

    await image.save();

    res.json({ 
      likes: image.likes, 
      liked: userIndex === -1 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if user liked image
router.get('/:id/liked', auth, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const liked = image.likedBy && image.likedBy.includes(req.user.id);
    res.json({ liked });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get contributor's uploads
router.get('/my/uploads', auth, async (req, res) => {
  try {
    const images = await Image.find({ contributor: req.user.id })
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    
    res.json(images);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete image (only by contributor)
router.delete('/:id', auth, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Check if user is the contributor
    if (image.contributor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this image' });
    }

    // Check if image has been purchased
    const hasPurchases = await Purchase.findOne({ image: req.params.id });
    
    if (hasPurchases) {
      return res.status(400).json({ 
        message: 'Cannot delete image that has been purchased. Contact support if you need assistance.' 
      });
    }

    // Delete the image file from uploads folder
    const imagePath = path.join(__dirname, '..', image.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Image.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
