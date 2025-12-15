const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress.controller');

// Đường dẫn gốc: /api/progress

router.route('/')
  .post(progressController.markLessonCompleted)  // POST: Đánh dấu xong bài
  .get(progressController.getProgressByCourse);  // GET: Lấy danh sách bài đã xong

module.exports = router;