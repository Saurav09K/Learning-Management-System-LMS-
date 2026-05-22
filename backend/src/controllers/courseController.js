const mongoose = require("mongoose");

const Course = require("../models/course.model");
const User = require("../models/user.model");
const redisClient = require('../config/redis')

// @desc    Create a new course
// @route   POST /api/courses
const createCourse = async (req, res) => {
  try {
    // req.user.id comes from our authMiddleware
    const courseData = {
      ...req.body,
      instructor: req.user.id 
    };

    const course = await Course.create(courseData);

    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all published courses (Public Catalog)
// @route   GET /api/courses
const getCourses = async (req, res) => {
  try {

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const skip = (page - 1) * limit;

    const totalCourses = await Course.countDocuments({ published: true });

    const courses = await Course.find({})
      .select('-modules') 
      .populate('instructor', 'name')
      .skip(skip)
      .limit(limit); 

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalCourses / limit),
      totalCourses,
      count: courses.length,
      courses
    });

    } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single course by ID (Full details with lessons)
// @route   GET /api/courses/:id
const getCourseById = async (req, res) => {

  const cacheKey = `course:${req.params.id}`;

  try {
   
    const cachedCourse = await redisClient.get(cacheKey);

    if (cachedCourse) {
      return res.status(200).json({
        success: true,
        course: JSON.parse(cachedCourse)
      });
    }

    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    await redisClient.set(cacheKey, JSON.stringify(course), {
            EX: 3600
        });
    
    res.status(200).json({ success: true, course });

    
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
const updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this course' });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Returns the updated document
      runValidators: true // Ensures Mongoose schema rules are respected
    });

    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this course' });
    }

    await course.deleteOne();

    res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// @desc    Get courses for the logged-in instructor
// @route   GET /api/courses/me
const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .select('-modules') 
      .populate('instructor', 'name');

    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


// @desc    Add a video lesson to a specific module
// @route   POST /api/courses/:courseId/modules/:moduleId/lessons
const addLesson = async (req, res) => {
  try {
    const { title, videoUrl, videoPublicId, duration } = req.body;
    const { courseId, moduleId } = req.params;
    
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this course' });
    }

    const targetModule = course.modules.id(moduleId);
    
    if (!targetModule) {
      return res.status(404).json({ message: 'Module not found' });
    }

    targetModule.lessons.push({ 
      title, 
      videoUrl, 
      videoPublicId, 
      duration: duration || 0 
    });

    await course.save();

    res.status(200).json({ message: 'Lesson added successfully!', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Create a new module in a course
// @route   POST /api/courses/:courseId/modules
const addModule = async (req, res) => {
  try {
    const { title } = req.body;
    const { courseId } = req.params;

    // 1. Find the course
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // 2. Security Check: Ensure the logged-in instructor owns this course
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this course' });
    }

    // 3. Push the new module (the lessons array will be empty by default)
    course.modules.push({ title });

    // 4. Save to database
    await course.save();

    res.status(201).json({ message: 'Module created successfully', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  addLesson,
  addModule,
};
