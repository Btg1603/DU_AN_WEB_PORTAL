const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');

// Đường dẫn gốc: /api/courses

// GET /api/courses -> Lấy danh sách
// POST /api/courses -> Tạo mới
router.route('/')
  .get(courseController.getCourses)
  .post(courseController.createCourse);

// Các đường dẫn cần ID: /api/courses/:id
// GET -> Xem chi tiết
// PUT -> Sửa
// DELETE -> Xóa
router.route('/:id')
  .get(courseController.getCourse)
  .put(courseController.updateCourse)
  .delete(courseController.deleteCourse);

module.exports = router;