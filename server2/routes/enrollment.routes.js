const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollment.controller');

// Đường dẫn gốc: /api/enrollments

router.route('/')
  .post(enrollmentController.createEnrollment) // Đăng ký
  .get(enrollmentController.getEnrollments);   // Lấy danh sách (kèm ?userId=...)

router.route('/:id')
  .delete(enrollmentController.deleteEnrollment); // Hủy đăng ký

module.exports = router;