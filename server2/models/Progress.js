const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProgressSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    courseId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Course', 
        required: true 
    },
    // Giả định sectionId là Lesson ObjectId
    lessonId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Lesson', 
        required: true 
    }, 
    completedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Progress', ProgressSchema);