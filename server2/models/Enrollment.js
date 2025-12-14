const mongoose = require('mongoose');
const { Schema } = mongoose;

const EnrollmentSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    courseId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Course', 
        required: [true, 'ID khóa học là bắt buộc']
        // Cần xử lý trường hợp courseId là null trong JSON mẫu (tốt hơn nên set required: true)
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    }
    // Bạn có thể thêm trường `isCompleted` nếu cần theo dõi trạng thái hoàn thành.
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);