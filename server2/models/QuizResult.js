const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuizResultSchema = new Schema({
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    quizId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Quiz', 
        required: true 
    },
    score: {
        type: Number,
        min: 0,
        max: 100
    },
    correct: Number,
    total: Number,
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('QuizResult', QuizResultSchema);