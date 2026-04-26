const express = require('express');
const router = express.Router();

const {
  enrollInCourse,
  getStudentEnrollments,
  updateLessonProgress
} = require('../controllers/enrollmentController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('student'), enrollInCourse);
router.get('/my-courses', protect, authorize('student'), getStudentEnrollments);
router.put('/progress', protect, authorize('student'), updateLessonProgress);

module.exports = router;