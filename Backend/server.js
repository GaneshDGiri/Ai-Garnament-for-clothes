require('dotenv').config();
const express = require('express'); // 1. Import Express
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Product = require('./models/Product');
const User = require('./models/User'); // Ensure you have this model

// --- 2. INITIALIZE APP (This was missing or misplaced) ---
const app = express(); 

// --- 3. MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- 4. DATABASE CONNECTION ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gani-garment';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_123';

// --- 5. ROUTES ---

// A. PRODUCT ROUTES
app.get('/api/products', async (req, res) => {
  try {
    const { category, material, sort, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (material) query.material = material;
    if (search) query.name = { $regex: search, $options: 'i' };

    let products = Product.find(query);

    if (sort === 'low-high') products = products.sort({ price: 1 });
    if (sort === 'high-low') products = products.sort({ price: -1 });

    const result = await products.exec();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// B. AUTH ROUTES (Register)
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, profileImage } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword,
      profileImage: profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
    });
    
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// C. AUTH ROUTES (Login)
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        profileImage: user.profileImage 
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 6. START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));