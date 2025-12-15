const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  category: { type: String, enum: ['Shirt', 'Pant', 'Dress'] }, // Shirt AI vs Pant area
  material: { type: String, enum: ['Cotton', 'Polyester', 'Silk', 'Denim'] },
  price: Number,
  image: String, // URL to the clothing image
  tryOnModelId: String // specific ID for the AI model to recognize this cloth
});

module.exports = mongoose.model('Product', ProductSchema);