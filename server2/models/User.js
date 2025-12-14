const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // MongoDB sẽ tự động tạo _id (ObjectId) thay cho id string của JSON Server
    username: {
        type: String,
        required: [true, 'Tên đăng nhập là bắt buộc'],
        unique: true,
        trim: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'Email là bắt buộc'],
        unique: true,
        lowercase: true,
        // Có thể thêm Regex cho validation email
    },
    password: {
        type: String,
        required: [true, 'Mật khẩu là bắt buộc'],
        // LƯU Ý QUAN TRỌNG: LUÔN PHẢI HASH MẬT KHẨU TRƯỚC KHI LƯU VÀO DB
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Chỉ cho phép 2 giá trị này
        default: 'user'
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    fullName: String, // Có thể tự động tạo từ firstName và lastName
    phone: String,
    studentCode: String,
    birthday: Date, // Chuyển đổi chuỗi ngày tháng ("2000-01-15") sang kiểu Date
    avatar: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);