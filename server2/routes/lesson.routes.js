// routes/lesson.routes.js (Phiên bản đã sửa lỗi, sử dụng middleware tập trung)
const express = require('express');
const router = express.Router();

// Imports
const Lesson = require('../models/Lesson');
// SỬ DỤNG LẠI CÁC MIDDLEWARE TỪ THƯ MỤC CHUNG
const { protect, admin } = require('../middleware/authMiddleware'); 
const { checkValidId } = require('../middleware/validationMiddleware');

// -------------------------------------------------------------------

// @desc   Lấy TẤT CẢ Lessons (Public - để hiển thị)
// @route   GET /lessons
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Lấy tất cả bài học và thông tin khóa học
        const lessons = await Lesson.find({}).populate('courseId'); 
        res.json(lessons);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi Server khi lấy tất cả bài học.' });
    }
});

// @desc    Lấy tất cả Lessons cho một Course cụ thể
// @route   GET /lessons/course/:courseId 
// @access  Public
// Dùng checkValidId cho tham số courseId
router.get('/course/:courseId', checkValidId, async (req, res) => {
    try {
        console.log('[GET /lessons/course/:courseId] courseId:', req.params.courseId);
        const lessons = await Lesson.find({ courseId: req.params.courseId }).sort('order');
        console.log('[GET /lessons/course/:courseId] Found lessons:', lessons.length);
        res.json(lessons);
    } catch (error) {
        console.error('[GET /lessons/course/:courseId] Error:', error.message);
        res.status(500).json({ message: 'Lỗi Server khi lấy danh sách bài học.' });
    }
});

// @desc    Lấy một Lesson theo ID
// @route   GET /lessons/:id
// @access  Public 
// Dùng checkValidId cho tham số id (lessonId)
router.get('/:id', checkValidId, async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id).populate('courseId');
        if (lesson) {
            res.json(lesson);
        } else {
            res.status(404).json({ message: 'Không tìm thấy bài học.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi Server khi lấy bài học chi tiết.' });
    }
});

// @desc    Tạo Lesson mới (Admin)
// @route   POST /lessons
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    // ... (logic tạo lesson như trước)
    // Thêm kiểm tra đầu vào cơ bản
    if (!req.body.courseId || !req.body.title || !req.body.content) {
        return res.status(400).json({ message: 'Vui lòng cung cấp courseId, title và content.' });
    }
    
    const { courseId, title, content, order, videoUrl } = req.body;
    try {
        const lesson = new Lesson({
            courseId, title, content, order: order || 1, videoUrl,
        });
        const createdLesson = await lesson.save();
        res.status(201).json(createdLesson);
    } catch (error) {
        res.status(400).json({ message: 'Tạo bài học thất bại.', error: error.message });
    }
});

// @desc   Cập nhật Lesson (Admin)
// @route   PUT /lessons/:id
// @access  Private/Admin
router.put('/:id', protect, admin, checkValidId, async (req, res) => {
    const { title, content, order, videoUrl } = req.body;
    try {
        const lesson = await Lesson.findById(req.params.id);

        if (lesson) {
            lesson.title = title || lesson.title;
            lesson.content = content || lesson.content;
            lesson.order = order || lesson.order;
            lesson.videoUrl = videoUrl || lesson.videoUrl;

            const updatedLesson = await lesson.save();
            res.json(updatedLesson);
        } else {
            res.status(404).json({ message: 'Không tìm thấy bài học để cập nhật.' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Cập nhật bài học thất bại.', error: error.message });
    }
});

// @desc   Xóa Lesson (Admin)
// @route   DELETE /lessons/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, checkValidId, async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndDelete(req.params.id);

        if (lesson) {
            res.json({ message: 'Bài học đã được xóa thành công.' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy bài học để xóa.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi Server khi xóa bài học.', error: error.message });
    }
});

module.exports = router;