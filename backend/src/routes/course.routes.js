const express = require('express');
const router = express.Router();

const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  addLesson,  
  addModule
} = require('../controllers/courseController');

const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/me', protect, authorize('instructor'), getInstructorCourses);

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Protected Instructor routes
router.post('/', protect, authorize('instructor'), createCourse);
router.put('/:id', protect, authorize('instructor'), updateCourse);
router.delete('/:id', protect, authorize('instructor'), deleteCourse);
router.post('/:courseId/modules/:moduleId/lessons',protect,authorize('instructor'),  addLesson);
router.post('/:courseId/modules', protect, authorize('instructor'), addModule);

module.exports = router;