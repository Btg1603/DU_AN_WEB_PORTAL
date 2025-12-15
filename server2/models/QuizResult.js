const mongoose = require('mongoose');

const QuizResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  // Mảng lưu đáp án của User cho từng câu hỏi
  userAnswers: [
    {
      questionIndex: { type: Number, required: true }, // Index của câu hỏi trong mảng questions của Quiz
      selectedOption: { type: Number, required: true }  // Index của đáp án user chọn (0, 1, 2, 3...)
    }
  ],
  score: {
    type: Number, // Số câu trả lời đúng
    required: true,
    default: 0
  },
  totalQuestions: {
    type: Number, // Tổng số câu hỏi của bài Quiz
    required: true
  },
  percentage: {
    type: Number, // Phần trăm làm đúng
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// Đảm bảo user chỉ nộp 1 lần cho mỗi Quiz (Nếu cần giới hạn)
// Nếu bạn muốn cho user làm lại nhiều lần, thì bỏ dòng dưới đi
// QuizResultSchema.index({ user: 1, quiz: 1 }, { unique: true });

module.exports = mongoose.model('QuizResult', QuizResultSchema);