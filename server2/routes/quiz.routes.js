const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');

// Đường dẫn gốc: /api/quizzes

router.route('/')
  .post(quizController.createQuiz)       // Tạo bài quiz
  .get(quizController.getQuizzesByCourse); // Lấy danh sách quiz theo khóa

router.route('/:id')
  .get(quizController.getQuizById)       // Lấy chi tiết 1 bài quiz
  .delete(quizController.deleteQuiz);    // Xóa

module.exports = router;