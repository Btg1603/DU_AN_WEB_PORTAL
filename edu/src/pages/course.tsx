import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronDown, Play, Users, BookMarked, Star } from "lucide-react";
import ContactFooter from "../components/footer";
import Navbar from "../components/navbar";
import Rating from "../components/Rating";
import { apiGet, apiPost, apiPut } from "../api/client";
import { useAuth } from "../context/AuthContext";

// ========== DATA KHÓA HỌC ==========
const coursesData = [
  {
    id: 1,
    title: "Ngữ pháp cơ bản",
    students: 120,
    lessons: 12,
    price: "Miễn phí",
    description: "Học 12 thì tiếng Anh cơ bản",
    sections: [
      {
        id: 1,
        title: "Thì Hiện Tại Đơn",
        videoUrl: "https://www.youtube.com/embed/Ssbujp7m6cM",
      },
      {
        id: 2,
        title: "Thì Hiện Tại Tiếp Diễn",
        videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
      },
      {
        id: 3,
        title: "Thì Hiện Tại Hoàn Thành",
        videoUrl: "https://www.youtube.com/embed/M7lc1UVf-VE",
      },
      {
        id: 4,
        title: "Thì Hiện Tại Hoàn Thành Tiếp Diễn",
        videoUrl: "https://www.youtube.com/embed/kJQP7kiw5Fk",
      },
      {
        id: 5,
        title: "Thì Quá Khứ Đơn",
        videoUrl: "https://www.youtube.com/embed/3tmd-ClpJxA",
      },
      {
        id: 6,
        title: "Thì Quá Khứ Tiếp Diễn",
        videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
      },
      {
        id: 7,
        title: "Thì Quá Khứ Hoàn Thành",
        videoUrl: "https://www.youtube.com/embed/TzXXHVhGXTQ",
      },
      {
        id: 8,
        title: "Thì Quá Khứ Hoàn Thành Tiếp Diễn",
        videoUrl: "https://www.youtube.com/embed/ALZHF5UqnU4",
      },
      {
        id: 9,
        title: "Thì Tương Lai Đơn",
        videoUrl: "https://www.youtube.com/embed/uelHwf8o7_U",
      },
      {
        id: 10,
        title: "Thì Tương Lai Tiếp Diễn",
        videoUrl: "https://www.youtube.com/embed/yPYZpwSpKmA",
      },
      {
        id: 11,
        title: "Thì Tương Lai Hoàn Thành",
        videoUrl: "https://www.youtube.com/embed/ZXsQAXx_ao0",
      },
      {
        id: 12,
        title: "Thì Tương Lai Hoàn Thành Tiếp Diễn",
        videoUrl: "https://www.youtube.com/embed/tgbNymZ7vqY",
      },
    ],
  },
  {
    id: 2,
    title: "Từ vựng cơ bản",
    students: 98,
    lessons: 38,
    price: "Miễn phí",
    description: "Học từ vựng tiếng Anh theo chủ đề",
    sections: [
      {
        id: 1,
        title: "Từ vựng về gia đình",
        videoUrl: "https://www.youtube.com/embed/Ssbujp7m6cM",
      },
      {
        id: 2,
        title: "Từ vựng về công việc",
        videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
      },
      {
        id: 3,
        title: "Từ vựng về du lịch",
        videoUrl: "https://www.youtube.com/embed/M7lc1UVf-VE",
      },
      {
        id: 4,
        title: "Từ vựng về thực phẩm",
        videoUrl: "https://www.youtube.com/embed/kJQP7kiw5Fk",
      },
    ],
  },
  {
    id: 4,
    title: "Phát âm cơ bản",
    students: 75,
    lessons: 10,
    price: "Miễn phí",
    description: "Học cách phát âm tiếng Anh chuẩn từ cơ bản",
    sections: [
      {
        id: 1,
        title: "Từ vựng về gia đình",
        videoUrl: "https://www.youtube.com/embed/Ssbujp7m6cM",
      },
      {
        id: 2,
        title: "Từ vựng về công việc",
        videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
      },
      {
        id: 3,
        title: "Từ vựng về du lịch",
        videoUrl: "https://www.youtube.com/embed/M7lc1UVf-VE",
      },
      {
        id: 4,
        title: "Từ vựng về thực phẩm",
        videoUrl: "https://www.youtube.com/embed/kJQP7kiw5Fk",
      },
    ],
  },
  {
    id: 5,
    title: "Giao tiếp hàng ngày",
    students: 150,
    lessons: 15,
    price: "Miễn phí",
    description: "Học các câu giao tiếp tiếng Anh thông dụng trong cuộc sống",
    sections: [
      {
        id: 1,
        title: "Từ vựng về gia đình",
        videoUrl: "https://www.youtube.com/embed/Ssbujp7m6cM",
      },
      {
        id: 2,
        title: "Từ vựng về công việc",
        videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
      },
      {
        id: 3,
        title: "Từ vựng về du lịch",
        videoUrl: "https://www.youtube.com/embed/M7lc1UVf-VE",
      },
      {
        id: 4,
        title: "Từ vựng về thực phẩm",
        videoUrl: "https://www.youtube.com/embed/kJQP7kiw5Fk",
      },
    ],
  },
  {
    id: 6,
    title: "Nghe hiểu cơ bản",
    students: 110,
    lessons: 12,
    price: "Miễn phí",
    description: "Rèn luyện kỹ năng nghe hiểu tiếng Anh từ cơ bản",
    sections: [
      {
        id: 1,
        title: "Từ vựng về gia đình",
        videoUrl: "https://www.youtube.com/embed/Ssbujp7m6cM",
      },
      {
        id: 2,
        title: "Từ vựng về công việc",
        videoUrl: "https://www.youtube.com/embed/9bZkp7q19f0",
      },
      {
        id: 3,
        title: "Từ vựng về du lịch",
        videoUrl: "https://www.youtube.com/embed/M7lc1UVf-VE",
      },
      {
        id: 4,
        title: "Từ vựng về thực phẩm",
        videoUrl: "https://www.youtube.com/embed/kJQP7kiw5Fk",
      },
    ],
  },
];

// ===================================

interface Rating {
  id: string;
  userId: number;
  courseId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: {
    username: string;
    fullName?: string;
    avatar?: string;
  };
}

interface Enrollment {
  id: number | string;
  userId: number | string;
  courseId: number | string;
  enrolledAt: string;
}

interface Lesson {
  id: number | string;
  courseId: number | string;
  order: number;
  title: string;
  videoUrl: string;
}

interface ApiCourse {
  id: number | string;
  title: string;
  category: string;
  level: string;
  students: number;
  lessons: number;
  price: string;
  featured: boolean;
  description: string;
  thumbnail?: string;
}

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  // CourseId có thể là MongoDB ObjectId string, không phải number
  const id = courseId;
  const { user } = useAuth();

  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const [currentSection, setCurrentSection] = useState<number | null>(null);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [course, setCourse] = useState<ApiCourse | null>(null);
  const [loading, setLoading] = useState(true);

  interface Progress {
    id?: string;
    userId: number | string;
    courseId: number | string;
    sectionId: number;
    completedAt: string;
  }

  // Load course, enrollments and lessons from server
  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesRes, enrollmentsRes] = await Promise.all([
          apiGet<ApiCourse[]>("/courses"),
          apiGet<Enrollment[]>("/enrollments"),
        ]);
        
        // Find course by id (handle both string ObjectId and number)
        const foundCourse = coursesRes.find((c) => {
          const cId = String(c.id);
          return cId === id;
        });
        
        setCourse(foundCourse || null);
        setEnrollments(enrollmentsRes);
        
        // Lấy lessons cho course này
        if (foundCourse) {
          const courseId = typeof foundCourse.id === 'string' ? foundCourse.id : String(foundCourse.id);
          const lessonsRes = await apiGet<Lesson[]>(`/lessons/course/${courseId}`);
          const sortedLessons = lessonsRes.sort((a, b) => a.order - b.order);
          setLessons(sortedLessons);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  // Load progress from server
  useEffect(() => {
    const loadProgress = async () => {
      if (!user || !course || lessons.length === 0) return;
      try {
        const progressData = await apiGet<Progress[]>(`/progress?userId=${user.id}&courseId=${id}`);
        // Map progress sectionId to lesson id (sectionId should match lesson.id or lesson.order)
        const completed = progressData.map((p) => {
          // Try to match by lesson id first, then by order
          const lesson = lessons.find((l) => {
            const lessonId = typeof l.id === 'string' ? Number(l.id) : l.id;
            return lessonId === p.sectionId;
          });
          if (lesson) {
            return typeof lesson.id === 'string' ? Number(lesson.id) : lesson.id;
          }
          // If not found by id, try by order (sectionId might be order)
          const lessonByOrder = lessons.find((l) => l.order === p.sectionId);
          return lessonByOrder ? (typeof lessonByOrder.id === 'string' ? Number(lessonByOrder.id) : lessonByOrder.id) : p.sectionId;
        });
        setCompletedSections(completed);
      } catch (err) {
        // If progress endpoint doesn't exist or error, start with empty array
        console.log("Progress not available, starting fresh");
        setCompletedSections([]);
      }
    };
    if (user && course && lessons.length > 0) {
      loadProgress();
    }
  }, [user, course, id, lessons]);

  // Reset state khi courseId thay đổi
  useEffect(() => {
    if (lessons.length > 0) {
      const firstLesson = lessons[0];
      const firstLessonId = typeof firstLesson.id === 'string' ? Number(firstLesson.id) : firstLesson.id;
      setCurrentSection(firstLessonId);
      setExpandedSection(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [courseId, lessons]);

  // Load ratings
  useEffect(() => {
    const loadRatings = async () => {
      try {
        const [allRatings, allUsers] = await Promise.all([
          apiGet<Rating[]>(`/ratings?courseId=${id}`),
          apiGet<Array<{ id: number; username: string; fullName?: string; avatar?: string }>>("/user"),
        ]);

        // Map user info to ratings
        const ratingsWithUsers = allRatings.map((rating) => ({
          ...rating,
          user: allUsers.find((u) => u.id === rating.userId),
        }));

        setRatings(ratingsWithUsers);

        // Calculate average rating
        if (allRatings.length > 0) {
          const avg = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
          setAverageRating(Math.round(avg * 10) / 10);
        }

        // Find user's existing rating
        if (user) {
          const existingRating = allRatings.find((r) => r.userId === user.id);
          if (existingRating) {
            setUserRating(existingRating.rating);
            setComment(existingRating.comment || "");
          }
        }
      } catch (err) {
        console.error("Error loading ratings:", err);
      }
    };
    if (id) {
      loadRatings();
    }
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="text-center bg-white p-12 rounded-2xl shadow-xl border border-gray-200">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            Khóa học không tồn tại!
          </h2>
          <Link
            to="/coursepage"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors"
          >
            <span>←</span>
            <span>Quay lại danh sách khóa học</span>
          </Link>
        </div>
      </div>
    );
  }

  const selectSection = (sectionId: number) => {
    setExpandedSection(sectionId);
    setCurrentSection(sectionId);
  };

  const markSectionComplete = async (sectionId: number) => {
    if (!user || !course || completedSections.includes(sectionId)) return;
    
    try {
      // Find the lesson to get its order (sectionId in progress should match lesson.id or lesson.order)
      const lesson = lessons.find((l) => {
        const lessonId = typeof l.id === 'string' ? Number(l.id) : l.id;
        return lessonId === sectionId;
      });
      
      // Save to server - use lesson.id as sectionId, or fallback to sectionId
      const progressData: Progress = {
        userId: user.id,
        courseId: id,
        sectionId: lesson ? (typeof lesson.id === 'string' ? Number(lesson.id) : lesson.id) : sectionId,
        completedAt: new Date().toISOString(),
      };
      
      await apiPost<Progress>("/progress", progressData);
      
      // Update local state
      setCompletedSections([...completedSections, sectionId]);
    } catch (err) {
      console.error("Error saving progress:", err);
      // Still update local state even if server save fails
      setCompletedSections([...completedSections, sectionId]);
    }
  };

  const getCurrentSection = () => {
    const currentLesson = lessons.find((l) => {
      const lessonId = typeof l.id === 'string' ? Number(l.id) : l.id;
      return lessonId === currentSection;
    });
    
    if (currentLesson) {
      return {
        id: typeof currentLesson.id === 'string' ? Number(currentLesson.id) : currentLesson.id,
        title: currentLesson.title,
        videoUrl: currentLesson.videoUrl,
      };
    }
    
    // Fallback to first lesson
    if (lessons.length > 0) {
      const firstLesson = lessons[0];
      return {
        id: typeof firstLesson.id === 'string' ? Number(firstLesson.id) : firstLesson.id,
        title: firstLesson.title,
        videoUrl: firstLesson.videoUrl,
      };
    }
    
    // Final fallback
    return {
      id: 1,
      title: "Bài học",
      videoUrl: "",
    };
  };

  const courseProgress = lessons.length > 0 
    ? Math.round((completedSections.length / lessons.length) * 100)
    : 0;

  // Calculate accurate students and lessons count
  const getCourseStudents = () => {
    const courseIdNum = id;
    const uniqueUsers = new Set(
      enrollments
        .filter((e) => {
          const enrollmentCourseId = typeof e.courseId === 'string' ? Number(e.courseId) : e.courseId;
          return String(enrollmentCourseId) === String(courseIdNum);
        })
        .map((e) => String(e.userId))
    );
    return uniqueUsers.size;
  };

  const getCourseLessons = () => {
    const courseIdNum = id;
    return lessons.filter((l) => {
      const lessonCourseId = typeof l.courseId === 'string' ? Number(l.courseId) : l.courseId;
      return String(lessonCourseId) === String(courseIdNum);
    }).length;
  };

  const handleSubmitRating = async () => {
    if (!user || !userRating) {
      alert("Vui lòng chọn số sao đánh giá");
      return;
    }

    setSubmitting(true);
    try {
      const ratingData = {
        userId: user.id,
        courseId: id,
        rating: userRating,
        comment: comment.trim() || undefined,
        createdAt: new Date().toISOString(),
      };

      // Check if user already rated
      const existingRating = ratings.find((r) => r.userId === user.id);

      if (existingRating) {
        // Update existing rating
        await apiPut(`/ratings/${existingRating.id}`, ratingData);
      } else {
        // Create new rating
        await apiPost("/ratings", ratingData);
      }

      // Reload ratings with user info
      const [allRatings, allUsers] = await Promise.all([
        apiGet<Rating[]>(`/ratings?courseId=${id}`),
        apiGet<Array<{ id: number; username: string; fullName?: string; avatar?: string }>>("/user"),
      ]);

      const ratingsWithUsers = allRatings.map((rating) => ({
        ...rating,
        user: allUsers.find((u) => u.id === rating.userId),
      }));

      setRatings(ratingsWithUsers);

      if (allRatings.length > 0) {
        const avg = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
        setAverageRating(Math.round(avg * 10) / 10);
      }

      setShowRatingForm(false);
      alert("Đánh giá của bạn đã được lưu!");
    } catch (err) {
      console.error("Error submitting rating:", err);
      alert("Có lỗi xảy ra khi gửi đánh giá");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Navbar */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4 font-medium">Đang tải khóa học...</p>
          </div>
        )}
        
        {!loading && !course && (
          <div className="text-center py-12 bg-red-50 border-2 border-red-200 rounded-xl">
            <p className="text-red-600 font-semibold">Không tìm thấy khóa học</p>
          </div>
        )}
        
        {!loading && course && lessons.length === 0 && (
          <div className="text-center py-12 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
            <p className="text-yellow-600 font-semibold">Khóa học chưa có bài học</p>
          </div>
        )}
        
        {!loading && course && lessons.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="relative bg-black aspect-video">
                {getCurrentSection().videoUrl ? (
                  <iframe
                    key={`${courseId}-${currentSection}`}
                    src={getCurrentSection().videoUrl}
                    title={getCurrentSection().title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <div className="text-center text-white">
                      <p className="text-xl font-semibold">Không có video</p>
                      <p className="text-sm text-gray-400">Bài học này chưa có video</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 bg-gradient-to-br from-white to-gray-50">
                <h1 className="text-3xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {course.title}
                </h1>
                {course.description && (
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">{course.description}</p>
                )}
                <div className="flex items-center gap-8 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-700">{getCourseStudents()} học viên</span>
                  </div>
                  <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-lg">
                    <BookMarked className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-gray-700">{lessons.length} bài học</span>
                  </div>
                </div>

                <button
                  onClick={() => markSectionComplete(currentSection!)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                  disabled={completedSections.includes(currentSection!)}
                >
                  {completedSections.includes(currentSection!) ? (
                    <>
                      <span className="text-xl">✓</span>
                      <span>Đã hoàn thành</span>
                    </>
                  ) : (
                    <>
                      <span>Đánh dấu hoàn thành</span>
                      <span className="text-lg">→</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Ratings Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Đánh giá khóa học
                  </h2>
                  {averageRating > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg">
                        <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                        <span className="text-xl font-bold text-gray-900">
                          {averageRating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        ({ratings.length} đánh giá)
                      </span>
                    </div>
                  )}
                </div>
                {user && (
                  <button
                    onClick={() => setShowRatingForm(!showRatingForm)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {userRating > 0 ? "Sửa đánh giá" : "Đánh giá khóa học"}
                  </button>
                )}
              </div>

              {/* Rating Form */}
              {showRatingForm && user && (
                <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      Đánh giá của bạn
                    </label>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <Rating
                        rating={userRating}
                        onRatingChange={setUserRating}
                        size="lg"
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                      Nhận xét (tùy chọn)
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Chia sẻ trải nghiệm của bạn về khóa học này..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white shadow-sm"
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSubmitRating}
                      disabled={submitting || !userRating}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                    </button>
                    <button
                      onClick={() => {
                        setShowRatingForm(false);
                        setComment("");
                        if (!userRating) setUserRating(0);
                      }}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-white hover:border-gray-400 transition-all duration-300"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}

              {/* Ratings List */}
              <div className="space-y-5">
                {ratings.length === 0 ? (
                  <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-300">
                    <Star className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">
                      Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá khóa học này!
                    </p>
                  </div>
                ) : (
                  ratings.map((rating) => (
                    <div
                      key={rating.id}
                      className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg">
                          {rating.user?.fullName?.[0] || rating.user?.username?.[0] || "U"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-gray-900 text-lg">
                              {rating.user?.fullName || rating.user?.username || "Người dùng"}
                            </span>
                            <Rating rating={rating.rating} readonly size="sm" />
                          </div>
                          {rating.comment && (
                            <p className="text-gray-700 text-base leading-relaxed mt-3 mb-2">{rating.comment}</p>
                          )}
                          <p className="text-xs text-gray-500 font-medium">
                            {new Date(rating.createdAt).toLocaleDateString("vi-VN", {
                              year: "numeric",
                              month: "long",
                              day: "numeric"
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto border border-gray-200">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Nội dung khoá học
                </h3>
                <p className="text-sm text-gray-600 font-medium mb-4">
                  {lessons.length} bài học
                </p>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">Tiến độ học tập</span>
                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                      {completedSections.length}/{lessons.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${courseProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 font-medium text-center">
                    {courseProgress}% hoàn thành
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {lessons.map((lesson) => {
                  const lessonId = typeof lesson.id === 'string' ? Number(lesson.id) : lesson.id;
                  const isCompleted = completedSections.includes(lessonId);
                  const isCurrent = currentSection === lessonId;
                  return (
                    <div key={lesson.id}>
                      <button
                        onClick={() =>
                          setExpandedSection(
                            expandedSection === lessonId ? null : lessonId
                          )
                        }
                        className="w-full p-4 flex items-center justify-between hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group"
                      >
                        <span className="font-semibold text-gray-800 text-left group-hover:text-blue-600 transition-colors">
                          {lesson.title}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-500 transition-transform duration-300 group-hover:text-blue-600 ${expandedSection === lessonId ? "rotate-180" : ""
                            }`}
                        />
                      </button>

                      {expandedSection === lessonId && (
                        <div className="bg-gradient-to-br from-gray-50 to-blue-50">
                          <div
                            onClick={() => selectSection(lessonId)}
                            className={`px-5 py-4 hover:bg-white cursor-pointer transition-all duration-200 border-l-4 rounded-r-lg mx-2 my-2 ${isCurrent
                              ? "border-blue-500 bg-white shadow-md"
                              : "border-transparent hover:border-blue-300"
                              }`}
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 ${isCompleted
                                  ? "bg-gradient-to-br from-green-500 to-green-600"
                                  : isCurrent
                                    ? "bg-gradient-to-br from-blue-500 to-purple-600"
                                    : "bg-gray-300"
                                  }`}
                              >
                                {isCompleted ? (
                                  <span className="text-white text-lg font-bold">✓</span>
                                ) : (
                                  <Play className="w-5 h-5 text-white" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p
                                  className={`text-sm font-semibold ${isCurrent
                                    ? "text-blue-600"
                                    : "text-gray-800"
                                    }`}
                                >
                                  {lesson.title}
                                </p>
                                {isCurrent && (
                                  <p className="text-xs text-blue-500 mt-1 font-medium">Đang phát</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Footer */}
      <ContactFooter />
    </div>
  );
}
