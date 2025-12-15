// server.js

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
app.use(cors()); 
app.use(express.json()); 

// 4. Kết nối Database MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/education_portal';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); 
  });

// 5. Khai báo Routes (Lỗi xảy ra ở đâu đó trong các dòng này nếu file Route bị lỗi)
// Dòng 30 nằm ở khu vực này, hãy kiểm tra file Route tương ứng nếu lỗi xảy ra!
app.use('/api/users', require('./routes/user.routes')); // Dòng ~30
app.use('/api/courses', require('./routes/course.routes'));
app.use('/api/lessons', require('./routes/lesson.routes'));
app.use('/api/enrollments', require('./routes/enrollment.routes'));
app.use('/api/progress', require('./routes/progress.routes'));
app.use('/api/quizzes', require('./routes/quiz.routes'));
app.use('/api/quizResults', require('./routes/quizResults.routes'));
app.use('/api/ratings', require('./routes/rating.routes'));
console.log('✅ All routes loaded successfully');

// 6. Route mặc định
app.get('/', (req, res) => {
  res.send('API Education Portal đang chạy...');
});

// 7. XỬ LÝ LỖI TẬP TRUNG (GLOBAL ERROR HANDLER)
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
});

// 8. Khởi động Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});