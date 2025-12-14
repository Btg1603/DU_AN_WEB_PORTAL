// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User'); // Đảm bảo đường dẫn này đúng

// Middleware bảo vệ các route (yêu cầu đăng nhập) - BẮT BUỘC phải có token
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // 1. Kiểm tra Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    console.log('[protect] token:', token ? 'present' : 'missing');

    // Nếu không có token, trả về lỗi 401
    if (!token) {
        return res.status(401).json({ message: 'Không có token, vui lòng đăng nhập' });
    }

    try {
        // 2. Xác minh token
        console.log('[protect] JWT_SECRET:', process.env.JWT_SECRET ? 'present' : 'MISSING');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('[protect] decoded userId:', decoded.userId);

        // 3. Tìm user dựa trên ID trong token (loại trừ password)
        req.user = await User.findById(decoded.userId).select('-password'); 

        console.log('[protect] user found:', req.user ? req.user._id : 'NOT_FOUND');

        if (!req.user) {
            return res.status(401).json({ message: 'Không tìm thấy người dùng cho token này' });
        }

        next();
    } catch (error) {
        console.error('[protect] Error:', error.message);
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn', error: error.message });
    }
});

// Middleware kiểm tra phân quyền Admin
const admin = (req, res, next) => {
    // Giả định `req.user` đã được thiết lập bởi middleware `protect`
    if (req.user && req.user.role === 'admin') { // Dùng req.user.role thay vì req.user.isAdmin để khớp với User.js schema
        next(); // Cho phép truy cập
    } else {
        res.status(403); // Forbidden
        throw new Error('Không có quyền Admin');
    }
};

module.exports = { protect, admin };