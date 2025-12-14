
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// --- 1. IMPORT TẤT CẢ CÁC FILE ROUTE ---
const userRouter = require('./routes/user.routes');
const courseRouter = require('./routes/course.routes');
const lessonRouter = require('./routes/lesson.routes');
const enrollmentRouter = require('./routes/enrollment.routes'); 
const progressRouter = require('./routes/progress.routes');    
const quizRouter = require('./routes/quiz.routes');         
const ratingRouter = require('./routes/rating.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); 
        console.log('MongoDB kết nối thành công! 💾');
    } catch (err) {
       console.error('Lỗi kết nối MongoDB:', err.message);
        process.exit(1); 
    }
};

connectDB();

// --- 2. ĐỊNH NGHĨA CÁC ĐƯỜNG DẪN GỐC SỬ DỤNG ROUTER ĐÃ CHIA ---

// >>> SỬA LỖI ĐỊNH TUYẾN: THÊM '/api' để khớp với Frontend gọi: /api/users/login <<<
app.use('/api/users', userRouter);     
app.use('/api/courses', courseRouter);  
app.use('/api/lessons', lessonRouter);  
app.use('/api/enrollments', enrollmentRouter); 
app.use('/api/progress', progressRouter);
app.use('/api/quizzes', quizRouter); 
app.use('/api/ratings', ratingRouter);

// Tuyến đường mặc định
app.get('/', (req, res) => {
    res.send('LMS API Server đang hoạt động!');
});

// THÊM: Xử lý lỗi 404 (Nếu không có route nào match)
const notFound = (req, res, next) => {
    const error = new Error(`Không tìm thấy - ${req.originalUrl}`);
    res.status(404);
    next(error);
};
app.use(notFound);

// Khởi động Server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});