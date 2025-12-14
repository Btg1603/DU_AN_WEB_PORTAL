import React, { useEffect, useMemo, useState } from "react";
import { BookOpen, Users, ChevronRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ContactFooter from "../components/footer";
import { apiGet, apiPost } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/navbar";

interface ApiCourse {
  id: number;
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

interface Enrollment {
  id: number;
  userId: number;
  courseId: number | string;
  enrolledAt: string;
}

interface Rating {
  id: string;
  userId: number;
  courseId: number;
  rating: number;
  comment?: string;
  createdAt: string;
}

interface Lesson {
  id: number | string;
  courseId: number | string;
  order: number;
  title: string;
  videoUrl: string;
}

export default function NaukriCoursesPage() {
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [level, setLevel] = useState<string>("all");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load all enrollments to count students for each course
        // Also load user's enrollments separately to check if user is enrolled
        const [courseRes, allEnrollmentsRes, userEnrollmentsRes, ratingsRes, lessonsRes] = await Promise.all([
          apiGet<ApiCourse[]>("/courses"),
          apiGet<Enrollment[]>("/enrollments"), // Load ALL enrollments
          user
            ? apiGet<Enrollment[]>(`/enrollments?userId=${user.id}`)
            : Promise.resolve([] as Enrollment[]),
          apiGet<Rating[]>("/ratings"),
          apiGet<Lesson[]>("/lessons"),
        ]);
        setCourses(courseRes);
        setEnrollments(allEnrollmentsRes); // Use all enrollments for counting students
        setRatings(ratingsRes);
        setLessons(lessonsRes);

        // Set user enrollments for checking if user is enrolled
        setUserEnrollments(userEnrollmentsRes);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách khoá học");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const getAverageRating = (courseId: number) => {
    const courseRatings = ratings.filter((r) => r.courseId === courseId);
    if (courseRatings.length === 0) return 0;
    const avg = courseRatings.reduce((sum, r) => sum + r.rating, 0) / courseRatings.length;
    return Math.round(avg * 10) / 10;
  };

  // Get user's enrolled courses separately for checking enrollment status
  const [userEnrollments, setUserEnrollments] = useState<Enrollment[]>([]);

  const enrolledCourseIds = useMemo(
    () => new Set(userEnrollments.map((e) => e.courseId)),
    [userEnrollments]
  );

  // Helper functions to calculate accurate data
  const getCourseStudents = (courseId: number | string) => {
    const courseIdNum = typeof courseId === 'string' ? Number(courseId) : courseId;
    const uniqueUsers = new Set(
      enrollments
        .filter((e) => {
          const enrollmentCourseId = typeof e.courseId === 'string' ? Number(e.courseId) : e.courseId;
          return enrollmentCourseId === courseIdNum;
        })
        .map((e) => String(e.userId))
    );
    return uniqueUsers.size;
  };

  const getCourseLessons = (courseId: number | string) => {
    const courseIdNum = typeof courseId === 'string' ? Number(courseId) : courseId;
    return lessons.filter((l) => {
      const lessonCourseId = typeof l.courseId === 'string' ? Number(l.courseId) : l.courseId;
      return lessonCourseId === courseIdNum;
    }).length;
  };

  const filteredCourses = useMemo(
    () =>
      courses.filter((c) => {
        const matchSearch =
          !search ||
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.description.toLowerCase().includes(search.toLowerCase());
        const matchCategory =
          category === "all" || c.category.toLowerCase() === category;
        const matchLevel = level === "all" || c.level === level;
        return matchSearch && matchCategory && matchLevel;
      }),
    [courses, search, category, level]
  );

  const handleEnroll = async (courseId: number) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (enrolledCourseIds.has(courseId)) {
      navigate(`/coursedetail/${courseId}`);
      return;
    }
    try {
      const created = await apiPost<Enrollment>("/enrollments", {
        userId: user.id,
        courseId,
        enrolledAt: new Date().toISOString(),
      });
      setEnrollments((prev) => [...prev, created]);
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi ghi danh khoá học");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-pink-600/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tất cả khóa học
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Khám phá các khóa học phù hợp với bạn và bắt đầu hành trình học tập ngay hôm nay
            </p>
          </div>
        </div>
      </section>

      {/* Filter + Courses Section */}
      <section className="py-8 px-6 -mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <input
              type="text"
              placeholder="Tìm kiếm khoá học..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all md:col-span-2 bg-gray-50 hover:bg-white"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
            >
              <option value="all">Tất cả chủ đề</option>
              <option value="ngữ pháp">Ngữ pháp</option>
              <option value="từ vựng">Từ vựng</option>
              <option value="phát âm">Phát âm</option>
              <option value="giao tiếp">Giao tiếp</option>
            </select>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
            >
              <option value="all">Tất cả trình độ</option>
              <option value="Cơ bản">Cơ bản</option>
              <option value="Trung cấp">Trung cấp</option>
            </select>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4 font-medium">Đang tải khoá học...</p>
            </div>
          )}
          {error && (
            <div className="text-center py-8 bg-red-50 border-2 border-red-200 rounded-xl mb-6">
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200"
              >
                <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative h-56 flex items-center justify-center overflow-hidden">
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="relative text-center text-white z-10 px-4">
                    <p className="text-xl font-bold line-clamp-2 drop-shadow-lg">
                      {course.title}
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-white to-gray-50">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 flex-wrap">
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-gray-700">{getCourseStudents(course.id)}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-lg">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                      <span className="font-semibold text-gray-700">{getCourseLessons(course.id)} bài học</span>
                    </div>
                    {getAverageRating(course.id) > 0 && (
                      <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-lg">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-gray-700">{getAverageRating(course.id)}</span>
                      </div>
                    )}
                  </div>

                  <h4 className="font-bold text-gray-900 mb-4 line-clamp-2 text-lg group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h4>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-blue-600 font-bold text-xl bg-blue-50 px-4 py-2 rounded-lg">
                      {course.price}
                    </span>
                    <button
                      onClick={() => handleEnroll(course.id)}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:from-blue-600 hover:to-purple-700 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                    >
                      {enrolledCourseIds.has(course.id)
                        ? "Vào học"
                        : "Ghi danh ngay"}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!loading && filteredCourses.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">
                Không tìm thấy khóa học nào phù hợp với bộ lọc của bạn
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <ContactFooter />
    </div>
  );
}
