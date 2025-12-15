const Rating = require('../models/Rating');
const Course = require('../models/Course');

// Hàm tính toán và cập nhật điểm trung bình của Khóa học (Được gọi sau khi tạo/sửa rating)
const calculateAverageRating = async (courseId) => {
  const stats = await Rating.aggregate([
    {
      $match: { course: courseId } // Chỉ lấy đánh giá của khóa học này
    },
    {
      $group: {
        _id: '$course',
        averageRating: { $avg: '$rating' }, // Tính điểm trung bình
        numRatings: { $sum: 1 }            // Tính tổng số lượt đánh giá
      }
    }
  ]);

  try {
    if (stats.length > 0) {
      // Cập nhật vào Model Course
      await Course.findByIdAndUpdate(courseId, {
        averageRating: Math.round(stats[0].averageRating * 10) / 10, // Làm tròn 1 chữ số
        numRatings: stats[0].numRatings
      });
    } else {
      // Nếu không có đánh giá nào, reset về 0
      await Course.findByIdAndUpdate(courseId, {
        averageRating: 0,
        numRatings: 0
      });
    }
  } catch (err) {
    console.error("Lỗi khi cập nhật điểm trung bình khóa học:", err);
  }
};

// @desc    Tạo đánh giá mới
// @route   POST /api/ratings
exports.createRating = async (req, res) => {
  try {
    const { userId, courseId, rating, comment } = req.body;

    // Kiểm tra đã đánh giá chưa (do index unique có thể báo lỗi mã 11000)
    const exists = await Rating.findOne({ user: userId, course: courseId });
    if (exists) {
        return res.status(400).json({ success: false, error: 'Bạn đã đánh giá khóa học này rồi. Vui lòng cập nhật thay vì tạo mới.' });
    }

    const newRating = await Rating.create({
      user: userId,
      course: courseId,
      rating,
      comment
    });

    // Sau khi tạo thành công, gọi hàm cập nhật điểm trung bình
    await calculateAverageRating(courseId);

    res.status(201).json({
      success: true,
      data: newRating
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Lấy tất cả đánh giá cho 1 khóa học
// @route   GET /api/ratings?courseId=...
exports.getRatingsByCourse = async (req, res) => {
  try {
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({ success: false, error: 'Vui lòng cung cấp courseId' });
    }

    // Populate 'user' để biết ai đã đánh giá (chỉ lấy username)
    const ratings = await Rating.find({ course: courseId })
      .populate({
        path: 'user',
        select: 'username'
      })
      .sort({ createdAt: -1 }); // Sắp xếp đánh giá mới nhất lên đầu

    res.status(200).json({
      success: true,
      count: ratings.length,
      data: ratings
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};