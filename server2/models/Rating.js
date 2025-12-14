const mongoose = require('mongoose');
const { Schema } = mongoose;

const RatingSchema = new Schema({
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
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Rating', RatingSchema);