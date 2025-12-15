const Progress = require('../models/Progress');

// @desc    Đánh dấu đã hoàn thành bài học
// @route   POST /api/progress
exports.markLessonCompleted = async (req, res) => {
  try {
    const { userId, courseId, lessonId } = req.body;

    if (!userId || !courseId || !lessonId) {
      return res.status(400).json({ success: false, error: 'Thiếu thông tin (userId, courseId, lessonId)' });
    }

    // Kiểm tra xem đã hoàn thành chưa để tránh lỗi trùng lặp
    // Mặc dù Model đã có unique index, nhưng check ở đây để trả về message thân thiện hơn
    const exists = await Progress.findOne({ user: userId, lesson: lessonId });
    
    if (exists) {
        // Nếu đã học rồi thì thôi, trả về success luôn (để frontend không báo lỗi)
        return res.status(200).json({ success: true, data: exists, message: 'Đã hoàn thành trước đó' });
    }

    const progress = await Progress.create({
      user: userId,
      course: courseId,
      lesson: lessonId
    });

    res.status(201).json({
      success: true,
      data: progress
    });

  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Lấy danh sách các bài đã học của User trong 1 khóa
// @route   GET /api/progress?userId=...&courseId=...
exports.getProgressByCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.query;

    if (!userId || !courseId) {
      return res.status(400).json({ success: false, error: 'Cần userId và courseId trên URL' });
    }

    // Tìm tất cả các record progress khớp với user và course
    const progressList = await Progress.find({ user: userId, course: courseId });

    // Trả về danh sách ID các bài học đã xong (Frontend chỉ cần ID để map dấu tích xanh)
    const completedLessonIds = progressList.map(p => p.lesson);

    res.status(200).json({
      success: true,
      count: progressList.length,
      data: completedLessonIds 
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};