const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lesson.controller');

// Đường dẫn gốc: /api/lessons

router.route('/')
  .get(lessonController.getLessons)   // Lấy danh sách (có thể lọc theo courseId)
  .post(lessonController.createLesson); // Tạo bài học mới

router.route('/:id')
  .get(lessonController.getLesson)    // Xem chi tiết
  .put(lessonController.updateLesson) // Sửa
  .delete(lessonController.deleteLesson); // Xóa

module.exports = router;