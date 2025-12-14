const mongoose = require('mongoose');
const { Schema } = mongoose;

const LessonSchema = new Schema({
    // Sử dụng ObjectId để tham chiếu đến Course
    courseId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Course', // Tham chiếu đến Model Course
        required: true 
    }, 
    order: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    videoUrl: String
});

module.exports = mongoose.model('Lesson', LessonSchema);