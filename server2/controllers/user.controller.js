// controllers/user.controller.js
const User = require('../models/User'); // Cần Model User
const bcrypt = require('bcryptjs');     
const jwt = require('jsonwebtoken');    

// 1. Đăng ký người dùng mới
exports.register = async (req, res, next) => { 
    try {
        const { username, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'Email đã tồn tại' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = new User({ username, email, password: hashedPassword, role: 'student' });
        await user.save();

        res.status(201).json({ msg: 'Đăng ký thành công', user });
    } catch (err) {
        next(err); 
    }
};

// 2. Đăng nhập (Login)
// controllers/user.controller.js (Phần hàm login)

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        // 1. Kiểm tra đầu vào
        if (!email || !password) {
            return res.status(400).json({ msg: 'Vui lòng nhập đủ thông tin' });
        }

        // 2. TÌM NGƯỜI DÙNG VÀ BUỘC TRẢ VỀ PASSWORD
        // Thêm .select('+password') để lấy trường password (vì trường này có select: false trong Model)
        const user = await User.findOne({ email }).select('+password'); 
        
        // 3. Kiểm tra người dùng có tồn tại
        if (!user) {
            return res.status(400).json({ msg: 'Sai thông tin đăng nhập' });
        }

        // 4. SO SÁNH MẬT KHẨU (user.password bây giờ đã có giá trị)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Sai thông tin đăng nhập' });
        }

        // 5. KÝ TOKEN
        // Tạo payload chỉ chứa ID và role (không chứa password)
        const payload = { user: { id: user.id, role: user.role } };

        jwt.sign(payload, process.env.JWT_SECRET || 'secrettoken', { expiresIn: '1d' }, (err, token) => {
            if (err) throw err;
            
            // 6. Trả về Token và thông tin User (không có password)
            res.json({ 
                msg: 'Đăng nhập thành công', 
                token, 
                user: { id: user.id, username: user.username, email: user.email, role: user.role } 
            });
        });

    } catch (err) {
        // Xử lý các lỗi khác như lỗi kết nối DB
        next(err);
    }
};

// 3. Lấy thông tin user hiện tại (Để test, lấy ID từ body/query)
exports.getProfile = async (req, res, next) => { 
    try {
        const userId = req.body.id || req.query.id; 

        if (!userId) {
            return res.status(400).json({ msg: "Vui lòng gửi kèm User ID để tìm kiếm" });
        }

        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ msg: "Không tìm thấy user" });
        }

        res.json(user);
    } catch (err) {
        next(err);
    }
};