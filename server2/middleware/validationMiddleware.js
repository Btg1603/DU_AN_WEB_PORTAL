// middleware/validationMiddleware.js
const mongoose = require('mongoose');

// Middleware kiểm tra tính hợp lệ của ID trong params
const checkValidId = (req, res, next) => {
    // Kiểm tra ID trong params
    // Kiểm tra cả 'id' và 'courseId' hoặc bất kỳ param nào mà bạn muốn kiểm tra
    const idToCheck = req.params.id || req.params.courseId || req.params.lessonId || req.params.quizId;

    if (!idToCheck || !mongoose.Types.ObjectId.isValid(idToCheck)) {
        res.status(400).json({ 
            message: 'ID không hợp lệ.', 
            error: 'Định dạng ID MongoDB không đúng.' 
        });
        // Không gọi next() để dừng chuỗi middleware
    } else {
        next(); // ID hợp lệ, chuyển sang controller
    }
};

module.exports = { checkValidId };