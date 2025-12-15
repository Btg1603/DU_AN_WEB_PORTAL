const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Vui lòng nhập tên bài kiểm tra'],
    default: 'Bài kiểm tra'
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  // Mảng chứa các câu hỏi
  questions: [
    {
      questionText: { type: String, required: true }, // Nội dung câu hỏi
      options: [{ type: String, required: true }],    // Các đáp án (A, B, C, D)
      correctAnswer: { type: Number, required: true } // Vị trí đáp án đúng (0, 1, 2, 3...)
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quiz', QuizSchema);