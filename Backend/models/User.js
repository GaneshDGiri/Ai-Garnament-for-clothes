const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }, // Default avatar
  joinedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);