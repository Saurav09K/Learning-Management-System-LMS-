const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  hashedRefreshToken: { 
    type: String, 
    required: true,
    index: true,
    unique: true
  },
  deviceInfo: { 
    type: String, 
    required: true 
  },
  expiresAt: { 
    type: Date, 
    required: true,
    index: { expires: '0s' }
  }
}, { timestamps: true });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);