// routes/progress.routes.js
const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const { protect } = require('../middleware/authMiddleware');
const { checkValidId } = require('../middleware/validationMiddleware'); // Giả định

// @desc    Lấy tiến độ của người dùng hiện tại theo Course ID
// @route   GET /api/progress/course/:courseId
// @access  Private
router.get('/course/:courseId', protect, checkValidId, async (req, res) => {
    try {
        const progress = await Progress.find({ 
            userId: req.user._id, 
            courseId: req.params.courseId 
        }).populate('lessonId');
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi Server khi lấy tiến độ.' });
    }
});

// @desc    Đánh dấu một Lesson là hoàn thành
// @route   POST /api/progress/complete
// @access  Private
router.post('/complete', protect, async (req, res) => {
    const { courseId, lessonId } = req.body;
    try {
        const progress = await Progress.findOneAndUpdate(
            { userId: req.user._id, courseId, lessonId },
            { $set: { completedAt: new Date() } },
            { new: true, upsert: true } // Tạo mới nếu chưa có
        );
        res.json(progress);
    } catch (error) {
        res.status(400).json({ message: 'Cập nhật tiến độ thất bại.', error: error.message });
    }
});

module.exports = router;