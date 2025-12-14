const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. Cấu hình biến môi trường
dotenv.config();

// 2. Khởi tạo ứng dụng Express
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Middleware
app.use(cors()); // Cho phép Frontend gọi API
app.use(express.json()); // Cho phép đọc dữ liệu JSON từ body request

// 4. Kết nối Database MongoDB
// Lưu ý: Đảm bảo bạn đã có biến MONGO_URI trong file .env
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/education_portal';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    // Không dừng server ngay để debug dễ hơn, nhưng thực tế có thể process.exit(1)
  });

// 5. Khai báo Routes (Dựa trên danh sách file bạn gửi)
try {
    app.use('/api/users', require('./routes/user.routes'));
    app.use('/api/courses', require('./routes/course.routes'));
    app.use('/api/lessons', require('./routes/lesson.routes'));
    app.use('/api/enrollments', require('./routes/enrollment.routes'));
    app.use('/api/progress', require('./routes/progress.routes'));
    app.use('/api/quizzes', require('./routes/quiz.routes'));
    app.use('/api/quizResults', require('./routes/quizResults.routes'));
    app.use('/api/ratings', require('./routes/rating.routes'));
} catch (error) {
    console.error("⚠️ Lỗi khi load routes. Hãy kiểm tra xem file route có tồn tại không:", error.message);
}

// 6. Route mặc định để test server
app.get('/', (req, res) => {
  res.send('API Education Portal đang chạy...');
});

// 7. Khởi động Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});