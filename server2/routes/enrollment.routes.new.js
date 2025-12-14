// routes/enrollment.routes.js
const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const { protect } = require('../middleware/authMiddleware');
const { checkValidId } = require('../middleware/validationMiddleware'); 

// @desc    Lấy TẤT CẢ các đăng ký (Public - để đếm học viên per khóa)
// @route   GET /enrollments/all
// @access  Public
router.get('/all', async (req, res) => {
    try {
        const enrollments = await Enrollment.find({});
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi Server khi lấy danh sách đăng ký.' });
    }
});

// @desc    Lấy các khóa học mà user hiện tại đã đăng ký
// @route   GET /enrollments/user/me
// @access  Private
router.get('/user/me', protect, async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ userId: req.user._id }).populate('courseId');
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi Server khi lấy danh sách đăng ký.' });
    }
});

// @desc    Lấy tất cả các khóa học mà người dùng hiện tại đã đăng ký
// @route   GET /enrollments 
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        // userId được lấy từ req.user._id do middleware 'protect' thiết lập
        const enrollments = await Enrollment.find({ userId: req.user._id }).populate('courseId');
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi Server khi lấy danh sách đăng ký.' });
    }
});

// @desc    Đăng ký một khóa học mới
// @route   POST /enrollments
// @access  Private
// Thêm checkValidId để kiểm tra courseId trước khi xử lý logic
router.post('/', protect, async (req, res, next) => {
    const { courseId } = req.body;
    
    // Kiểm tra tính hợp lệ của courseId được gửi trong body (tương tự như checkValidId)
    // Hoặc có thể tạo một middleware riêng để check body ID. Tạm thời kiểm tra thủ công.
    if (!courseId || !require('mongoose').Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ message: 'Course ID không hợp lệ.' });
    }

    try {
        // Kiểm tra xem đã đăng ký chưa
        const exists = await Enrollment.findOne({ userId: req.user._id, courseId });
        if (exists) {
            return res.status(400).json({ message: 'Bạn đã đăng ký khóa học này rồi.' });
        }

        const enrollment = new Enrollment({
            userId: req.user._id,
            courseId,
            enrolledAt: new Date(),
        });
        const createdEnrollment = await enrollment.save();
        res.status(201).json(createdEnrollment);
    } catch (error) {
        res.status(400).json({ message: 'Đăng ký khóa học thất bại.', error: error.message });
    }
});

module.exports = router;
