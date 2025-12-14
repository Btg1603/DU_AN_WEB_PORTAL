// routes/user.routes.js (Phiên bản BỔ SUNG)
const express = require('express');
const router = express.Router();
// Đảm bảo bạn import protect và admin
const { protect, admin } = require('../middleware/authMiddleware'); 
// ... (existing imports: User, bcrypt, jwt, checkValidId)

// ... (existing POST /register, POST /login)

// [BỔ SUNG] @desc Lấy TẤT CẢ Users (Thường chỉ Admin)
// @route   GET /users
// @access  Private/Admin 
router.get('/', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('id username fullName avatar email role createdAt'); 
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi Server khi lấy danh sách người dùng.' });
    }
});

// [BỔ SUNG QUAN TRỌNG] @desc Lấy thông tin User hiện tại (Profile)
// @route   GET /users/me
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        // req.user được đặt bởi middleware 'protect'
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
             res.status(200).json({ 
                id: user._id, 
                username: user.username, 
                email: user.email, 
                role: user.role,
                fullName: user.fullName,
                avatar: user.avatar,
                // ... các trường khác
            });
        } else {
            res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi Server khi lấy thông tin người dùng.' });
    }
});

module.exports = router;