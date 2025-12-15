const express = require('express');
const router = express.Router();
const quizResultController = require('../controllers/quizResult.controller');

// Đường dẫn gốc: /api/quizResults

router.route('/')
  .post(quizResultController.submitQuiz)  // Nộp bài và chấm điểm
  .get(quizResultController.getResultsByUser); // Lấy lịch sử làm bài của User

module.exports = router;