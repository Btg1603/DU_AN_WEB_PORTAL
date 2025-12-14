// routes/quiz.routes.js (CHUYỂN ROUTE GỐC / SANG PUBLIC)
const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const { protect, admin } = require('../middleware/authMiddleware');
const { checkValidId } = require('../middleware/validationMiddleware');

// >>> BỔ SUNG ROUTE GỐC: GET /quizzes (LÀ PUBLIC) <<<
// @desc    Lấy TẤT CẢ Quizzes (Public)
// @route   GET /quizzes 
// @access  Public
router.get('/', async (req, res) => { 
    try {
        // Lấy tất cả quiz, loại trừ đáp án đúng
        const quizzes = await Quiz.find({}).select('-questions.correctAnswer'); 
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi Server khi lấy tất cả Quiz.' });
    }
});

// @desc    Lấy tất cả Quizzes cho một Course cụ thể (Public)
// @route   GET /quizzes/course/:courseId
// @access  Public
router.get('/course/:courseId', checkValidId, async (req, res) => { /* ... */ });

// ... (các route khác vẫn là Private)

module.exports = router;