// routes/rating.routes.js (Phiên bản TỐI ƯU HÓA)
const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const { protect, admin } = require('../middleware/authMiddleware'); 
const { checkValidId } = require('../middleware/validationMiddleware');

// -------------------------------------------------------------------
// ... (Các route GET / và GET /course giữ nguyên theo bản bạn cung cấp)

// @desc Lấy TẤT CẢ đánh giá (Public)
// @route   GET /ratings
// @access  Public
router.get('/', async (req, res) => {
    try {
        const ratings = await Rating.find({})
            .populate('userId', 'username fullName avatar'); 
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi Server khi lấy tất cả đánh giá.' });
    }
});

// [CẬP NHẬT POPULATE] @desc Lấy tất cả đánh giá cho một khóa học
// @route   GET /ratings/course/:courseId
// @access  Public
router.get('/course/:courseId', checkValidId, async (req, res) => {
    try {
        const ratings = await Rating.find({ courseId: req.params.courseId })
            // Cập nhật: Lấy thêm fullName và avatar để hiển thị review
            .populate('userId', 'username fullName avatar'); 
        
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi Server khi lấy đánh giá.' });
    }
});

// [TỐI ƯU LOGIC UPSERT] @desc Đánh giá/Cập nhật đánh giá khóa học
// @route   POST /ratings
// @access  Private
router.post('/', protect, async (req, res) => {
    const { courseId, rating, comment } = req.body;
    
    if (!courseId || !rating) {
        return res.status(400).json({ message: 'Vui lòng cung cấp courseId và rating.' });
    }
    
    try {
        // Dùng findOneAndUpdate với upsert: true để vừa tạo mới vừa cập nhật
        const newOrUpdatedRating = await Rating.findOneAndUpdate(
            { userId: req.user._id, courseId }, // Điều kiện tìm kiếm: user và khóa học
            { 
                $set: { rating, comment, createdAt: new Date() } 
            }, // Dữ liệu cần cập nhật
            { new: true, upsert: true } // Quan trọng: new: trả về object mới, upsert: tạo mới nếu không tìm thấy
        ).populate('userId', 'username fullName avatar'); // Populate lại để trả về data đầy đủ
        
        res.status(201).json(newOrUpdatedRating); 
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi lưu/cập nhật đánh giá.', error: error.message });
    }
});

module.exports = router;