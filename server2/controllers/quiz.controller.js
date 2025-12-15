const Quiz = require('../models/Quiz');
const Course = require('../models/Course');

// @desc    Tạo bài kiểm tra mới
// @route   POST /api/quizzes
exports.createQuiz = async (req, res) => {
  try {
    const { title, courseId, questions } = req.body;

    if (!courseId || !questions || questions.length === 0) {
      return res.status(400).json({ success: false, error: 'Cần có courseId và danh sách câu hỏi' });
    }

    // Kiểm tra khóa học tồn tại
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Khóa học không tồn tại' });
    }

    const quiz = await Quiz.create({
      title,
      course: courseId,
      questions
    });

    res.status(201).json({
      success: true,
      data: quiz
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Lấy danh sách Quiz theo Course
// @route   GET /api/quizzes?courseId=...
exports.getQuizzesByCourse = async (req, res) => {
  try {
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({ success: false, error: 'Vui lòng cung cấp courseId trên URL' });
    }

    const quizzes = await Quiz.find({ course: courseId });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Lấy chi tiết 1 bài Quiz (để làm bài)
// @route   GET /api/quizzes/:id
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy bài kiểm tra' });
    }

    res.status(200).json({ success: true, data: quiz });
  } catch (err) {
    res.status(400).json({ success: false, error: 'ID không hợp lệ' });
  }
};

// @desc    Xóa Quiz
// @route   DELETE /api/quizzes/:id
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, error: 'Not found' });

    await quiz.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};