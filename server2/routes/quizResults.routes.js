// routes/quizResults.routes.js
const express = require('express');
const router = express.Router();
const QuizResult = require('../models/QuizResult');
const { protect } = require('../middleware/authMiddleware');

// @desc    Nộp bài kiểm tra (tạo result mới)
// @route   POST /quizResults
// @access  Private (yêu cầu đăng nhập)
router.post('/', protect, async (req, res) => {
    try {
        const { quizId, score, correct, total, submittedAt } = req.body;
        
        // Kiểm tra dữ liệu bắt buộc
        if (!quizId || score === undefined || correct === undefined || total === undefined) {
            return res.status(400).json({ 
                message: 'Vui lòng cung cấp quizId, score, correct, total.' 
            });
        }

        // userId lấy từ authenticated user (req.user._id), không lấy từ body
        const quizResult = new QuizResult({
            userId: req.user._id, // Dùng từ token, không phải từ body
            quizId,
            score,
            correct,
            total,
            submittedAt: submittedAt ? new Date(submittedAt) : new Date(),
        });

        const result = await quizResult.save();
        res.status(201).json(result);
    } catch (error) {
        console.error('Lỗi khi nộp bài:', error);
        res.status(400).json({ 
            message: 'Nộp bài thất bại.', 
            error: error.message 
        });
    }
});

// @desc    Lấy tất cả kết quả quiz của user hiện tại
// @route   GET /quizResults/user/me
// @access  Private
router.get('/user/me', protect, async (req, res) => {
    try {
        const results = await QuizResult.find({ userId: req.user._id })
            .populate('quizId', 'title')
            .sort({ submittedAt: -1 });
        res.json(results);
    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi Server khi lấy kết quả quiz.' 
        });
    }
});

// @desc    Lấy kết quả quiz của một khóa học
// @route   GET /quizResults/quiz/:quizId
// @access  Private
router.get('/quiz/:quizId', protect, async (req, res) => {
    try {
        const results = await QuizResult.find({ 
            userId: req.user._id,
            quizId: req.params.quizId 
        })
            .populate('quizId', 'title')
            .sort({ submittedAt: -1 });
        res.json(results);
    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi Server khi lấy kết quả quiz.' 
        });
    }
});

// @desc    Lấy tất cả kết quả (Admin)
// @route   GET /quizResults
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const results = await QuizResult.find({})
            .populate('userId', 'username email')
            .populate('quizId', 'title')
            .sort({ submittedAt: -1 });
        res.json(results);
    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi Server khi lấy kết quả quiz.' 
        });
    }
});

module.exports = router;
