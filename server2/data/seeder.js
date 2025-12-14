// data/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// ⚠️ THÊM LƯỢNG TỬ ĐỂ HASH MẬT KHẨU
const bcrypt = require('bcryptjs'); 

// ⚠️ SỬA LỖI IMPORT: Import Models trực tiếp từ thư mục models
const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const Enrollment = require('../models/Enrollment');
const Progress = require('../models/Progress');
const Rating = require('../models/Rating');

const sampleData = require('./sampleData.js');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// Khởi tạo các Maps để lưu trữ ID thật (MongoDB ObjectId)
// Key: refId (chuỗi), Value: MongoDB ObjectId
const userMap = {};
const courseMap = {};
const lessonMap = {};
const quizMap = {};


// Hàm nhập dữ liệu
const importData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Kết nối DB thành công.');
        console.log('🗑️ Xóa dữ liệu cũ...');

        // 1. Xóa tất cả 
        await Promise.all([
            User.deleteMany(),
            Course.deleteMany(),
            Lesson.deleteMany(),
            Quiz.deleteMany(),
            QuizResult.deleteMany(),
            Enrollment.deleteMany(),
            Progress.deleteMany(),
            Rating.deleteMany(),
        ]);

        console.log('➕ Bắt đầu nhập dữ liệu mới...');

        // --- BƯỚC 1: NHẬP DỮ LIỆU CẤP 1 (Users, Courses) & TẠO MAP ---
        
        // 1.1. Users (THÊM LOGIC HASH MẬT KHẨU TẠI ĐÂY)
        const usersToInsert = [];
        for (const user of sampleData.users) {
            // HASH MẬT KHẨU TRƯỚC KHI CHÈN
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);

            usersToInsert.push({
                ...user,
                password: hashedPassword // Ghi đè mật khẩu rõ ràng bằng mật khẩu đã hash
            });
        }
        
        const createdUsers = await User.insertMany(usersToInsert);
        createdUsers.forEach(user => {
            // Ánh xạ bằng cách tìm lại refId từ dữ liệu mẫu dựa trên email (unique)
            const originalUser = sampleData.users.find(u => u.email === user.email);
            if (originalUser) {
                userMap[originalUser.refId] = user._id; 
            }
        });
        console.log(`- Đã nhập ${createdUsers.length} Users.`);


        // 1.2. Courses
        const createdCourses = await Course.insertMany(sampleData.courses);
        createdCourses.forEach(course => {
            // Ánh xạ bằng cách tìm lại refId từ dữ liệu mẫu dựa trên title (giả định unique)
            const originalCourse = sampleData.courses.find(c => c.title === course.title);
            if (originalCourse) {
                courseMap[originalCourse.refId] = course._id; 
            }
        });
        console.log(`- Đã nhập ${createdCourses.length} Courses.`);

        // --- BƯỚC 2: NHẬP DỮ LIỆU CẤP 2 (Lessons, Quizzes) & TẠO MAP ---

        // 2.1. Lessons (Phụ thuộc Course ID)
        const lessonsToInsert = sampleData.lessons
            .map(lesson => {
                const courseId = courseMap[lesson.courseRef];
                
                if (!courseId) {
                    console.error(`⚠️ BỎ QUA: Lesson (refId: ${lesson.refId}, courseRef: ${lesson.courseRef}) vì không tìm thấy courseId.`);
                    return null; 
                }
                
                return {
                    // Giữ lại các trường khác
                    ...lesson,
                    courseId: courseId
                };
            })
            .filter(lesson => lesson !== null); 
            
        const createdLessons = await Lesson.insertMany(lessonsToInsert);

        createdLessons.forEach(lesson => {
            // Ánh xạ bằng cách tìm lại refId từ dữ liệu mẫu dựa trên title (giả định unique trong Course)
            const originalLesson = sampleData.lessons.find(l => l.title === lesson.title);
            if (originalLesson) {
                lessonMap[originalLesson.refId] = lesson._id; 
            }
        });
        console.log(`- Đã nhập ${createdLessons.length} Lessons. (${sampleData.lessons.length - createdLessons.length} Lessons bị bỏ qua do thiếu courseRef)`);


        // 2.2. Quizzes (Phụ thuộc Course ID)
        const quizzesToInsert = sampleData.quizzes.map(quiz => ({
            ...quiz,
            courseId: courseMap[quiz.courseRef], // Ánh xạ Course ID
        }));
        const createdQuizzes = await Quiz.insertMany(quizzesToInsert);
        createdQuizzes.forEach(quiz => {
            const originalQuiz = sampleData.quizzes.find(q => q.title === quiz.title);
            if (originalQuiz) {
                quizMap[originalQuiz.refId] = quiz._id;
            }
        });
        console.log(`- Đã nhập ${createdQuizzes.length} Quizzes.`);

        // --- BƯỚC 3: NHẬP DỮ LIỆU CẤP 3 (Phụ thuộc nhiều ID) ---

        // 3.1. Enrollments
        const enrollmentData = sampleData.enrollments.map(e => ({
            userId: userMap[e.userRef],
            courseId: courseMap[e.courseRef],
            enrolledAt: e.enrolledAt,
        }));
        await Enrollment.insertMany(enrollmentData);
        console.log(`- Đã nhập ${enrollmentData.length} Enrollments.`);

        // 3.2. Ratings
        const ratingData = sampleData.ratings.map(r => ({
            userId: userMap[r.userRef],
            courseId: courseMap[r.courseRef],
            rating: r.rating,
            comment: r.comment,
            createdAt: r.createdAt,
        }));
        await Rating.insertMany(ratingData);
        console.log(`- Đã nhập ${ratingData.length} Ratings.`);


        // 3.3. Quiz Results
        const quizResultData = sampleData.quizResults.map(qr => ({
            userId: userMap[qr.userRef],
            quizId: quizMap[qr.quizRef],
            score: qr.score,
            correct: qr.correct,
            total: qr.total,
            submittedAt: qr.submittedAt,
        }));
        await QuizResult.insertMany(quizResultData);
        console.log(`- Đã nhập ${quizResultData.length} Quiz Results.`);
        
        // 3.4. Progress (Sử dụng lessonRef)
        const progressData = sampleData.progress
            .map(p => {
                const lessonId = lessonMap[p.lessonRef];
                if (!lessonId) {
                    console.error(`⚠️ BỎ QUA: Progress (userRef: ${p.userRef}, lessonRef: ${p.lessonRef}) vì không tìm thấy lessonId.`);
                    return null;
                }
                return {
                    userId: userMap[p.userRef],
                    courseId: courseMap[p.courseRef],
                    lessonId: lessonId, 
                    completedAt: p.completedAt,
                };
            })
            .filter(p => p !== null);

        await Progress.insertMany(progressData);
        console.log(`- Đã nhập ${progressData.length} Progress Records.`);

        console.log('🎉 Nhập dữ liệu thành công!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Lỗi khi nhập dữ liệu:', error);
        process.exit(1);
    }
};


// Hàm xóa dữ liệu (Giữ nguyên)
const destroyData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('🗑️ Xóa toàn bộ dữ liệu mẫu...');
        await Promise.all([
            User.deleteMany(),
            Course.deleteMany(),
            Lesson.deleteMany(),
            Quiz.deleteMany(),
            QuizResult.deleteMany(),
            Enrollment.deleteMany(),
            Progress.deleteMany(),
            Rating.deleteMany(),
        ]);
        console.log('✅ Xóa dữ liệu thành công!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi khi xóa dữ liệu:', error.message);
        process.exit(1);
    }
};

// Logic điều khiển
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}