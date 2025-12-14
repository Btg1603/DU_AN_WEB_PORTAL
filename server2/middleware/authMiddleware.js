// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User'); // Đảm bảo đường dẫn này đúng

// Middleware bảo vệ các route (yêu cầu đăng nhập)
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // 1. Kiểm tra Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Lấy token từ header (Bearer token)
            token = req.headers.authorization.split(' ')[1];

            // 2. Xác minh token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Tìm user dựa trên ID trong token (loại trừ password)
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                res.status(401); // Unauthorized
                throw new Error('Không tìm thấy người dùng cho token này');
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401); // Unauthorized
            throw new Error('Token không hợp lệ hoặc đã hết hạn');
        }
    }

    if (!token) {
        res.status(401); // Unauthorized
        throw new Error('Không có token, truy cập bị từ chối');
    }
});

// Middleware kiểm tra phân quyền Admin
const admin = (req, res, next) => {
    // Giả định `req.user` đã được thiết lập bởi middleware `protect`
    if (req.user && req.user.isAdmin) {
        next(); // Cho phép truy cập
    } else {
        res.status(403); // Forbidden
        throw new Error('Không có quyền Admin');
    }
};

module.exports = { protect, admin };