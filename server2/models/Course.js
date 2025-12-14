const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    category: String,
    level: String,
    students: {
        type: Number,
        default: 0
    },
    lessons: {
        type: Number,
        default: 0
    },
    price: {
        type: String, // Lưu là string theo JSON mẫu ("Miễn phí")
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    description: String,
    thumbnail: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Course', CourseSchema);