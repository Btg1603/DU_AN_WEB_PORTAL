const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

// @desc    Lấy danh sách bài học
// @route   GET /api/lessons
// @usage   GET /api/lessons?courseId=12345 (Lọc theo khóa học)
exports.getLessons = async (req, res) => {
  try {
    let query = {};

    // Nếu trên URL có gửi courseId (vd: /api/lessons?courseId=xxx) thì lọc theo course đó
    if (req.query.courseId) {
      query = { courseId: req.query.courseId };
    }

    // sort({ order: 1 }) để sắp xếp bài học theo thứ tự tăng dần (Bài 1 -> Bài 2)
    const lessons = await Lesson.find(query).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Tạo bài học mới
// @route   POST /api/lessons
exports.createLesson = async (req, res) => {
  try {
    // 1. Kiểm tra xem courseId có tồn tại không
    if (!req.body.courseId) {
      return res.status(400).json({ success: false, error: 'Phải cung cấp courseId' });
    }

    const courseExists = await Course.findById(req.body.courseId);
    if (!courseExists) {
      return res.status(404).json({ success: false, error: 'Khóa học không tồn tại' });
    }

    // 2. Tạo bài học
    const lesson = await Lesson.create(req.body);

    res.status(201).json({
      success: true,
      data: lesson
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Lấy chi tiết 1 bài học
// @route   GET /api/lessons/:id
exports.getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy bài học' });
    }
    res.status(200).json({ success: true, data: lesson });
  } catch (err) {
    res.status(400).json({ success: false, error: 'ID không hợp lệ' });
  }
};

// @desc    Cập nhật bài học
// @route   PUT /api/lessons/:id
exports.updateLesson = async (req, res) => {
  try {
    let lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy bài học' });
    }

    lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: lesson });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Xóa bài học
// @route   DELETE /api/lessons/:id
exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy bài học' });
    }

    await lesson.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};