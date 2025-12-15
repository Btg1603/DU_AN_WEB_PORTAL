const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const Rating = require('../models/Rating');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');

// @desc    Lấy tất cả khóa học
// @route   GET /api/courses
exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'instructor',
        select: 'username email'
      })
      .select('-__v');

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Lấy 1 khóa học theo ID
// @route   GET /api/courses/:id
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate({
        path: 'instructor',
        select: 'username email'
      })
      .select('-__v');

    if (!course) {
      return next(
        new ErrorResponse(`Không tìm thấy khóa học với ID ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};

// @desc    Tạo khóa học mới
// @route   POST /api/courses
exports.createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cập nhật khóa học
// @route   PUT /api/courses/:id
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return next(
        new ErrorResponse(`Không tìm thấy khóa học với ID ${req.params.id}`, 404)
      );
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('-__v');

    res.status(200).json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};

// @desc    Xóa khóa học (Cascade Delete)
// @route   DELETE /api/courses/:id
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return next(
        new ErrorResponse(`Không tìm thấy khóa học với ID ${req.params.id}`, 404)
      );
    }

    // Xóa dữ liệu liên quan
    await Rating.deleteMany({ course: req.params.id });
    await Lesson.deleteMany({ courseId: req.params.id });
    await Enrollment.deleteMany({ course: req.params.id });

    // Xóa khóa học
    await course.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
