const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Đảm bảo đường dẫn này đúng tới file model User của bạn
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Đăng ký (Register)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Kiểm tra user đã tồn tại chưa
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    // Tạo user mới (password sẽ được hash trong model nếu bạn đã cài hook pre-save, nếu chưa thì cần hash ở đây)
    // Giả sử model User của bạn đã xử lý hash password
    user = new User({ username, email, password });
    await user.save();

    // Tạo token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secretkey123', { expiresIn: '1h' });

    res.status(201).json({ token, userId: user._id, username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi đăng ký', error: error.message });
  }
});

// Đăng nhập (Login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // 2. Kiểm tra mật khẩu (Sử dụng hàm comparePassword nếu có trong Model, hoặc dùng bcrypt trực tiếp)
    // Lưu ý: Nếu trong User.js bạn chưa viết hàm matchPassword, hãy dùng dòng dưới đây:
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // 3. Tạo token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Payload
      process.env.JWT_SECRET || 'secretkey123', // Secret Key (nên để trong .env)
      { expiresIn: '1d' }
    );

    // 4. Trả về kết quả
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Lỗi login:", error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

module.exports = router;