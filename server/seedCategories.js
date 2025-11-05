const mongoose = require('mongoose');
require('dotenv').config();

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  imageCount: { type: Number, default: 0 }
});

const Category = mongoose.model('Category', categorySchema);

const categories = [
  { name: 'Nature', slug: 'nature', description: 'Natural landscapes, wildlife, plants' },
  { name: 'People', slug: 'people', description: 'Portraits, lifestyle, emotions' },
  { name: 'Business', slug: 'business', description: 'Office, meetings, corporate' },
  { name: 'Technology', slug: 'technology', description: 'Gadgets, computers, innovation' },
  { name: 'Food', slug: 'food', description: 'Cuisine, restaurants, cooking' },
  { name: 'Travel', slug: 'travel', description: 'Destinations, tourism, adventure' },
  { name: 'Architecture', slug: 'architecture', description: 'Buildings, structures, design' },
  { name: 'Fashion', slug: 'fashion', description: 'Clothing, style, accessories' },
  { name: 'Sports', slug: 'sports', description: 'Athletics, fitness, competition' },
  { name: 'Abstract', slug: 'abstract', description: 'Patterns, textures, artistic' },
  { name: 'Animals', slug: 'animals', description: 'Pets, wildlife, creatures' },
  { name: 'Education', slug: 'education', description: 'Learning, schools, students' },
  { name: 'Health', slug: 'health', description: 'Medical, wellness, fitness' },
  { name: 'Transportation', slug: 'transportation', description: 'Vehicles, travel, logistics' },
  { name: 'Events', slug: 'events', description: 'Celebrations, parties, gatherings' }
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/imagesbazaar');
    console.log('Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Insert new categories
    await Category.insertMany(categories);
    console.log(`✓ Successfully added ${categories.length} categories`);

    const allCategories = await Category.find().sort({ name: 1 });
    console.log('\nCategories in database:');
    allCategories.forEach(cat => console.log(`  - ${cat.name}`));

    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();
