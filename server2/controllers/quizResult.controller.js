const QuizResult = require('../models/QuizResult');
const Quiz = require('../models/Quiz');

// @desc    Nộp bài kiểm tra và chấm điểm
// @route   POST /api/quizResults
exports.submitQuiz = async (req, res) => {
  try {
    const { userId, quizId, userAnswers } = req.body;

    if (!userId || !quizId || !userAnswers || userAnswers.length === 0) {
      return res.status(400).json({ success: false, error: 'Thiếu thông tin user, quiz hoặc đáp án' });
    }

    // 1. Lấy đề bài gốc (Quiz) từ DB để chấm điểm
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, error: 'Không tìm thấy bài Quiz' });
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;

    // 2. Vòng lặp chấm điểm
    for (const userAnswer of userAnswers) {
      const questionIndex = userAnswer.questionIndex;
      const selectedOption = userAnswer.selectedOption;
      
      // Kiểm tra câu hỏi có tồn tại không
      if (questionIndex >= 0 && questionIndex < totalQuestions) {
        const correctOptionIndex = quiz.questions[questionIndex].correctAnswer;
        
        // So sánh đáp án của User với đáp án đúng
        if (selectedOption === correctOptionIndex) {
          correctCount++;
        }
      }
    }

    // 3. Tính toán kết quả
    const percentage = (correctCount / totalQuestions) * 100;

    // 4. Lưu kết quả vào DB
    const quizResult = await QuizResult.create({
      user: userId,
      quiz: quizId,
      userAnswers,
      score: correctCount,
      totalQuestions: totalQuestions,
      percentage: Math.round(percentage * 100) / 100 // Làm tròn 2 chữ số thập phân
    });

    res.status(201).json({
      success: true,
      message: 'Nộp bài thành công',
      data: quizResult
    });

  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Lấy tất cả kết quả làm bài của 1 user
// @route   GET /api/quizResults?userId=...
exports.getResultsByUser = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'Vui lòng cung cấp userId' });
    }

    // Lấy tất cả kết quả, populate để biết Quiz nào đã làm
    const results = await QuizResult.find({ user: userId }).populate({
        path: 'quiz',
        select: 'title course' // Chỉ lấy tên và khóa học của Quiz
    }).sort({ completedAt: -1 }); // Sắp xếp theo thời gian mới nhất

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};