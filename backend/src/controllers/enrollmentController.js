const Enrollment = require('../models/enrollment.model');
const Course = require('../models/course.model');

// @desc    Enroll a student in a course
// @route   POST /api/enrollments
const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'You are already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId,
      completedLessons: [] 
    });

    res.status(201).json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all courses a student is enrolled in 
// @route   GET /api/enrollments/my-courses
const getStudentEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate('course', 'title thumbnailUrl instructor');

    res.status(200).json({ success: true, count: enrollments.length, enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark a specific lesson as completed
// @route   PUT /api/enrollments/progress
const updateLessonProgress = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;

    let enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    });

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    await enrollment.save();

    res.status(200).json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  enrollInCourse,
  getStudentEnrollments,
  updateLessonProgress
};