const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');

// Đường dẫn gốc: /api/ratings

router.route('/')
  .post(ratingController.createRating)     // Tạo đánh giá mới
  .get(ratingController.getRatingsByCourse); // Lấy danh sách đánh giá của khóa học

module.exports = router;