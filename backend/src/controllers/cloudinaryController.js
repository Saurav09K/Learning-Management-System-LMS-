const cloudinary = require('../config/cloudinary');

// @desc    Generate a signature for React to upload files directly
// @route   GET /api/cloudinary/signature
const getSignature = (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      { timestamp: timestamp },
      process.env.CLOUDINARY_API_SECRET
    );

    res.status(200).json({ 
      success: true, 
      timestamp: timestamp, 
      signature: signature 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSignature,
};