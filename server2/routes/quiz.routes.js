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
        const quizzes = await Quiz.find({}).select('-questions.correctAnswer').lean(); 
        // Map lại _id thành id để khớp với frontend
        const quizzesWithId = quizzes.map(quiz => ({
            ...quiz,
            id: quiz._id.toString()
        }));
        res.json(quizzesWithId);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi Server khi lấy tất cả Quiz.' });
    }
});

// @desc    Lấy tất cả Quizzes cho một Course cụ thể (Public)
// @route   GET /quizzes/course/:courseId
// @access  Public
router.get('/course/:courseId', checkValidId, async (req, res) => { /* ... */ });

// @desc    Lấy một Quiz theo ID (Public)
// @route   GET /quizzes/:id
// @access  Public
router.get('/:id', checkValidId, async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).lean();
        if (quiz) {
            // Map lại _id thành id
            const quizWithId = {
                ...quiz,
                id: quiz._id.toString(),
                questions: quiz.questions.map(q => ({
                    ...q,
                    id: q._id ? q._id.toString() : q.id
                }))
            };
            res.json(quizWithId);
        } else {
            res.status(404).json({ message: 'Không tìm thấy bài kiểm tra.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi Server khi lấy bài kiểm tra.' });
    }
});

// ... (các route khác vẫn là Private)

module.exports = router;