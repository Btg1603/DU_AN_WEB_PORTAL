const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Vui lòng nhập tên bài học'],
    trim: true
  },
  content: {
    type: String, // Nội dung bài học (text) hoặc mô tả
    default: ''
  },
  videoUrl: {
    type: String, // Link video (Youtube, Vimeo, hoặc file server)
    required: [true, 'Bài học cần có video URL']
  },
  duration: {
    type: Number, // Thời lượng bài học (tính bằng phút hoặc giây)
    default: 0
  },
  courseId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // Liên kết với model Course
    required: true // Bắt buộc bài học phải thuộc về 1 khóa học
  },
  order: {
    type: Number, // Thứ tự bài học (Bài 1, Bài 2...)
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lesson', LessonSchema);