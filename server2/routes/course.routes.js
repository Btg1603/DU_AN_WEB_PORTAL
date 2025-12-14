// routes/course.routes.js
const express = require('express');
const router = express.Router();

// Imports
const Course = require('../models/Course'); // Đảm bảo tên model là chính xác
const { protect, admin } = require('../middleware/authMiddleware');
const { checkValidId } = require('../middleware/validationMiddleware');

// -------------------------------------------------------------------

// @desc   Lấy TẤT CẢ Courses (Route giải quyết lỗi 404 cho /courses)
// @route   GET /courses
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Lấy tất cả các khóa học, có thể thêm pagination/filter sau
        const courses = await Course.find({}); 
        res.json(courses);
    } catch (error) {
        // Gửi lỗi server 500 nếu có vấn đề về DB
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách khóa học.' });
    }
});

// @desc   Lấy một Course theo ID
// @route   GET /courses/:id
// @access  Public
router.get('/:id', checkValidId, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Không tìm thấy khóa học.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi Server khi lấy khóa học chi tiết.' });
    }
});

// @desc   Tạo Course mới (Admin)
// @route   POST /courses
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    // Thêm kiểm tra đầu vào cơ bản
    if (!req.body.title || !req.body.description || !req.body.category) {
        return res.status(400).json({ message: 'Vui lòng cung cấp tiêu đề, mô tả và danh mục.' });
    }
    
    // ... (Logic tạo khóa học - cần đảm bảo các trường req.body được định nghĩa đúng trong Course model)
    const { title, description, category, level, price, imageUrl } = req.body;
    
    try {
        const course = new Course({
            title,
            description,
            category,
            level,
            price: price || 0,
            imageUrl
        });
        const createdCourse = await course.save();
        res.status(201).json(createdCourse);
    } catch (error) {
        res.status(400).json({ message: 'Tạo khóa học thất bại.', error: error.message });
    }
});

// ... (Có thể thêm PUT/DELETE cho Admin nếu cần)

module.exports = router;