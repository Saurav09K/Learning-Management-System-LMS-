const express = require('express');
const router = express.Router();
const { getSignature } = require('../controllers/cloudinaryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/signature', protect, authorize('instructor'), getSignature);

module.exports = router;