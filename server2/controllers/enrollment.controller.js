const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Đăng ký khóa học (User enroll course)
// @route   POST /api/enrollments
exports.createEnrollment = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // 1. Kiểm tra input
    if (!userId || !courseId) {
      return res.status(400).json({ success: false, error: 'Cần có userId và courseId' });
    }

    // 2. Kiểm tra xem đã đăng ký chưa
    const exists = await Enrollment.findOne({ user: userId, course: courseId });
    if (exists) {
      return res.status(400).json({ success: false, error: 'User đã đăng ký khóa học này rồi' });
    }

    // 3. Tạo đăng ký mới
    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId
    });

    res.status(201).json({
      success: true,
      data: enrollment
    });

  } catch (err) {
    // Lỗi duplicate key (do đã set index unique trong model)
    if (err.code === 11000) {
        return res.status(400).json({ success: false, error: 'User đã đăng ký khóa học này rồi' });
    }
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Lấy danh sách khóa học đã đăng ký của 1 User
// @route   GET /api/enrollments?userId=xxxx
exports.getEnrollments = async (req, res) => {
  try {
    const { userId } = req.query;

    let query = {};
    if (userId) {
      query.user = userId;
    }

    // Populate 'course' để lấy luôn tên khóa học, ảnh... thay vì chỉ lấy ID
    const enrollments = await Enrollment.find(query)
      .populate({
        path: 'course',
        select: 'title description thumbnail' // Chỉ lấy các trường cần thiết
      });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Hủy đăng ký (Xóa)
// @route   DELETE /api/enrollments/:id
exports.deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy thông tin đăng ký' });
    }

    await enrollment.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};