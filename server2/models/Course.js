const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Vui lòng nhập tên khóa học'],
    trim: true,
    maxlength: [100, 'Tên khóa học không được quá 100 ký tự']
  },
  description: {
    type: String,
    required: [true, 'Vui lòng nhập mô tả khóa học']
  },
  price: {
    type: Number,
    default: 0 
  },
  thumbnail: {
    type: String,
    default: 'no-photo.jpg'
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Liên kết với Model User
    required: false 
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating không thể âm'],
    max: [5, 'Rating tối đa là 5']
  },
  numRatings: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', CourseSchema);