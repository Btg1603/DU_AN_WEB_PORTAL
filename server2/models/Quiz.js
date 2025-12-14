const mongoose = require('mongoose');
const { Schema } = mongoose;

// Sub-Schema cho từng câu hỏi
const QuestionSchema = new Schema({
    // Bỏ id số, MongoDB sẽ tạo _id
    question: {
        type: String,
        required: true
    },
    options: [String], // Mảng các lựa chọn String
    correctIndex: {
        type: Number, // Chỉ mục (index) của đáp án đúng trong mảng options
        required: true
    }
});

const QuizSchema = new Schema({
    courseId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Course', 
        required: true 
    },
    title: {
        type: String,
        required: true
    },
    questions: [QuestionSchema] // Mảng các câu hỏi (sử dụng Subdocument)
});

module.exports = mongoose.model('Quiz', QuizSchema);