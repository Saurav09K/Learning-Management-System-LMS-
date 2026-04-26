const express = require('express');
const router = express.Router();

const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Protected Instructor routes
router.post('/', protect, authorize('instructor'), createCourse);
router.put('/:id', protect, authorize('instructor'), updateCourse);
router.delete('/:id', protect, authorize('instructor'), deleteCourse);

module.exports = router;