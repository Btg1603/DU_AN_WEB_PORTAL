import { useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Upload,
  Eye,
  TrendingUp,
  FileText,
} from "lucide-react";
import { apiGet, apiPost, apiPut, apiDelete } from "../api/client";
import Navbar from "../components/navbar";

type Tab = "courses" | "students" | "reports";

interface Course {
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

interface Lesson {
  id: number;
  courseId: number;
  order: number;
  title: string;
  videoUrl: string;
}

interface Student {
  id: number | string;
  username: string;
  email: string;
  fullName?: string;
  role: string;
  studentCode?: string;
}

interface QuizResult {
  id: string;
  userId: number;
  quizId: number;
  score: number;
  correct: number;
  total: number;
  submittedAt: string;
  quiz?: { id: number; title: string };
}

interface Progress {
  id: string;
  userId: number | string;
  courseId: number;
  sectionId: number;
  completedAt: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("courses");
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Student form state
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentForm, setStudentForm] = useState({
    username: "",
    email: "",
    fullName: "",
    studentCode: "",
    phone: "",
  });

  // Quiz result form state
  const [showQuizResultForm, setShowQuizResultForm] = useState(false);
  const [editingQuizResult, setEditingQuizResult] = useState<QuizResult | null>(null);
  const [quizResultForm, setQuizResultForm] = useState({
    userId: 0,
    quizId: 0,
    score: 0,
    correct: 0,
    total: 0,
  });

  // Course form state
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: "",
    category: "",
    level: "",
    price: "Miễn phí",
    description: "",
    thumbnail: "",
  });

  // Lesson form state
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    videoUrl: "",
    order: 1,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [coursesRes, lessonsRes, usersRes, resultsRes, enrollmentsRes, progressRes, quizzesRes] =
        await Promise.all([
          apiGet<Course[]>("/courses"),
          apiGet<Lesson[]>("/lessons"),
          apiGet<Student[]>("/user"),
          apiGet<QuizResult[]>("/quizResults"),
          apiGet<any[]>("/enrollments"),
          apiGet<Progress[]>("/progress").catch(() => []), // Fallback to empty array if endpoint doesn't exist
          apiGet<any[]>("/quizzes").catch(() => []), // Load quizzes
        ]);

      setCourses(coursesRes);
      setLessons(lessonsRes);
      setStudents(usersRes.filter((u) => u.role === "user"));
      setQuizResults(resultsRes);
      setEnrollments(enrollmentsRes);
      setProgress(progressRes || []);
      setQuizzes(quizzesRes || []);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Course CRUD
  const handleCreateCourse = async () => {
    try {
      const newCourse = {
        ...courseForm,
        students: 0,
        lessons: 0,
        featured: false,
      };
      await apiPost("/courses", newCourse);
      await loadData();
      setShowCourseForm(false);
      resetCourseForm();
    } catch (err) {
      alert("Lỗi khi tạo khóa học");
    }
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse) return;
    try {
      await apiPut(`/courses/${editingCourse.id}`, {
        ...editingCourse,
        ...courseForm,
      });
      await loadData();
      setEditingCourse(null);
      setShowCourseForm(false);
      resetCourseForm();
    } catch (err) {
      alert("Lỗi khi cập nhật khóa học");
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa khóa học này?")) return;
    try {
      await apiDelete(`/courses/${id}`);
      await loadData();
    } catch (err) {
      alert("Lỗi khi xóa khóa học");
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      category: course.category,
      level: course.level,
      price: course.price,
      description: course.description,
      thumbnail: course.thumbnail || "",
    });
    setShowCourseForm(true);
  };

  const resetCourseForm = () => {
    setCourseForm({
      title: "",
      category: "",
      level: "",
      price: "Miễn phí",
      description: "",
      thumbnail: "",
    });
    setEditingCourse(null);
  };

  // Lesson CRUD
  const handleCreateLesson = async () => {
    if (!selectedCourseId) {
      alert("Vui lòng chọn khóa học");
      return;
    }
    try {
      const newLesson = {
        ...lessonForm,
        courseId: selectedCourseId,
      };
      await apiPost("/lessons", newLesson);
      await loadData();
      setShowLessonForm(false);
      resetLessonForm();
    } catch (err) {
      alert("Lỗi khi tạo bài học");
    }
  };

  const handleUpdateLesson = async () => {
    if (!editingLesson) return;
    try {
      await apiPut(`/lessons/${editingLesson.id}`, {
        ...editingLesson,
        ...lessonForm,
      });
      await loadData();
      setEditingLesson(null);
      setShowLessonForm(false);
      resetLessonForm();
    } catch (err) {
      alert("Lỗi khi cập nhật bài học");
    }
  };

  const handleDeleteLesson = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa bài học này?")) return;
    try {
      await apiDelete(`/lessons/${id}`);
      await loadData();
    } catch (err) {
      alert("Lỗi khi xóa bài học");
    }
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setSelectedCourseId(lesson.courseId);
    setLessonForm({
      title: lesson.title,
      videoUrl: lesson.videoUrl,
      order: lesson.order,
    });
    setShowLessonForm(true);
  };

  const resetLessonForm = () => {
    setLessonForm({
      title: "",
      videoUrl: "",
      order: 1,
    });
    setSelectedCourseId(null);
    setEditingLesson(null);
  };

  // Student CRUD
  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setStudentForm({
      username: student.username,
      email: student.email,
      fullName: student.fullName || "",
      studentCode: student.studentCode || "",
      phone: (student as any).phone || "",
    });
    setShowStudentForm(true);
  };

  const handleCreateStudent = async () => {
    try {
      await apiPost("/user", {
        ...studentForm,
        role: "user",
        password: "123456", // Default password
      });
      await loadData();
      setShowStudentForm(false);
      resetStudentForm();
    } catch (err) {
      alert("Lỗi khi tạo học viên");
    }
  };

  const handleUpdateStudent = async () => {
    if (!editingStudent) return;
    try {
      await apiPut(`/user/${editingStudent.id}`, {
        ...editingStudent,
        ...studentForm,
      });
      await loadData();
      setEditingStudent(null);
      setShowStudentForm(false);
      resetStudentForm();
    } catch (err) {
      alert("Lỗi khi cập nhật học viên");
    }
  };

  const handleDeleteStudent = async (id: number | string) => {
    if (!confirm("Bạn có chắc muốn xóa học viên này?")) return;
    try {
      await apiDelete(`/user/${id}`);
      await loadData();
    } catch (err) {
      alert("Lỗi khi xóa học viên");
    }
  };

  const resetStudentForm = () => {
    setStudentForm({
      username: "",
      email: "",
      fullName: "",
      studentCode: "",
      phone: "",
    });
    setEditingStudent(null);
  };

  // Quiz Result CRUD
  const handleEditQuizResult = (result: QuizResult) => {
    setEditingQuizResult(result);
    setQuizResultForm({
      userId: typeof result.userId === 'string' ? Number(result.userId) : result.userId,
      quizId: result.quizId,
      score: result.score,
      correct: result.correct,
      total: result.total,
    });
    setShowQuizResultForm(true);
  };

  const handleCreateQuizResult = async () => {
    if (!quizResultForm.userId || !quizResultForm.quizId) {
      alert("Vui lòng chọn học viên và bài quiz");
      return;
    }
    try {
      await apiPost("/quizResults", {
        userId: quizResultForm.userId,
        quizId: quizResultForm.quizId,
        score: quizResultForm.score,
        correct: quizResultForm.correct,
        total: quizResultForm.total,
        submittedAt: new Date().toISOString(),
      });
      await loadData();
      setShowQuizResultForm(false);
      resetQuizResultForm();
    } catch (err) {
      alert("Lỗi khi tạo điểm quiz");
    }
  };

  const handleUpdateQuizResult = async () => {
    if (!editingQuizResult) return;
    try {
      await apiPut(`/quizResults/${editingQuizResult.id}`, {
        ...editingQuizResult,
        ...quizResultForm,
      });
      await loadData();
      setEditingQuizResult(null);
      setShowQuizResultForm(false);
      resetQuizResultForm();
    } catch (err) {
      alert("Lỗi khi cập nhật điểm quiz");
    }
  };

  const handleDeleteQuizResult = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa điểm quiz này?")) return;
    try {
      await apiDelete(`/quizResults/${id}`);
      await loadData();
    } catch (err) {
      alert("Lỗi khi xóa điểm quiz");
    }
  };

  const resetQuizResultForm = () => {
    setQuizResultForm({
      userId: 0,
      quizId: 0,
      score: 0,
      correct: 0,
      total: 0,
    });
    setEditingQuizResult(null);
  };

  // Mock upload video
  const handleUploadVideo = () => {
    alert("Tính năng upload video đang được mô phỏng. Vui lòng nhập URL video YouTube.");
  };

  // Reports calculations
  const getCourseViews = (courseId: number | string) => {
    // Count total enrollments for this course (not unique users)
    // Handle both string and number courseId
    const courseIdNum = typeof courseId === 'string' ? Number(courseId) : courseId;
    return enrollments.filter((e) => {
      const enrollmentCourseId = typeof e.courseId === 'string' ? Number(e.courseId) : e.courseId;
      return enrollmentCourseId === courseIdNum;
    }).length;
  };

  const getCourseStudents = (courseId: number | string) => {
    // Count unique students enrolled in this course
    // Handle both string and number courseId
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
    // Count lessons for this course
    // Handle both string and number courseId
    const courseIdNum = typeof courseId === 'string' ? Number(courseId) : courseId;
    return lessons.filter((l) => {
      const lessonCourseId = typeof l.courseId === 'string' ? Number(l.courseId) : l.courseId;
      return lessonCourseId === courseIdNum;
    }).length;
  };

  const getTotalViews = () => {
    // Sum of all course views (must match the sum in the detailed table)
    return courses.reduce((sum, course) => sum + getCourseViews(course.id), 0);
  };

  const getCompletionRate = (courseId: number | string) => {
    // Handle both string and number courseId
    const courseIdNum = typeof courseId === 'string' ? Number(courseId) : courseId;
    const courseLessons = lessons.filter((l) => {
      const lessonCourseId = typeof l.courseId === 'string' ? Number(l.courseId) : l.courseId;
      return lessonCourseId === courseIdNum;
    });
    if (courseLessons.length === 0) return 0;

    // Get all enrollments for this course
    const courseEnrollments = enrollments.filter((e) => {
      const enrollmentCourseId = typeof e.courseId === 'string' ? Number(e.courseId) : e.courseId;
      return enrollmentCourseId === courseIdNum;
    });
    if (courseEnrollments.length === 0) return 0;

    // Get unique enrolled user IDs (handle both number and string IDs)
    const enrolledUserIds = Array.from(
      new Set(courseEnrollments.map((e) => String(e.userId)))
    );

    // Get progress records for this course
    const courseProgress = progress.filter((p) => {
      const progressCourseId = typeof p.courseId === 'string' ? Number(p.courseId) : p.courseId;
      return progressCourseId === courseIdNum;
    });

    // Total number of sections/lessons in this course
    const totalSections = courseLessons.length;

    // For each enrolled user, calculate their completion percentage
    let totalCompletionRate = 0;

    enrolledUserIds.forEach((userIdStr) => {
      // Find progress for this user - ensure we compare as strings
      const userProgress = courseProgress.filter(
        (p) => String(p.userId) === userIdStr
      );

      let userCompletionRate = 0;

      if (userProgress.length > 0) {
        // Get unique sectionIds completed by this user
        const completedSections = new Set(userProgress.map((p) => p.sectionId));
        // Calculate completion percentage for this user
        userCompletionRate = (completedSections.size / totalSections) * 100;
      }
      // If user has no progress, userCompletionRate remains 0

      totalCompletionRate += userCompletionRate;
    });

    // Calculate average completion rate: sum of all users' completion / number of users
    if (enrolledUserIds.length === 0) return 0;

    const averageCompletion = totalCompletionRate / enrolledUserIds.length;
    return Math.round(averageCompletion);
  };

  const getAverageCompletionRate = () => {
    if (courses.length === 0) return 0;
    const totalRate = courses.reduce(
      (sum, c) => sum + getCompletionRate(c.id),
      0
    );
    return Math.round(totalRate / courses.length);
  };

  const getAverageQuizScore = (userId: number | string) => {
    // Convert userId to number for comparison
    const userIdNum = typeof userId === 'string' ? Number(userId) : userId;
    // Handle NaN case (e.g., if userId is a non-numeric string)
    if (isNaN(userIdNum)) {
      // Try to find by string comparison as fallback
      const userResults = quizResults.filter((r) => String(r.userId) === String(userId));
      if (userResults.length === 0) return 0;
      const avg =
        userResults.reduce((sum, r) => sum + r.score, 0) / userResults.length;
      return Math.round(avg);
    }
    const userResults = quizResults.filter((r) => r.userId === userIdNum || String(r.userId) === String(userId));
    if (userResults.length === 0) return 0;
    const avg =
      userResults.reduce((sum, r) => sum + r.score, 0) / userResults.length;
    return Math.round(avg);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Navbar />


      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-pink-600/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Trang quản trị
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Quản lý khóa học, học viên và báo cáo
            </p>
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white rounded-xl p-2 shadow-lg border border-gray-200">
          <button
            onClick={() => setActiveTab("courses")}
            className={`px-6 py-3 font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 ${activeTab === "courses"
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Quản lý khóa học</span>
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`px-6 py-3 font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 ${activeTab === "students"
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
          >
            <Users className="w-5 h-5" />
            <span>Quản lý học viên</span>
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-6 py-3 font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 ${activeTab === "reports"
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Báo cáo</span>
          </button>
        </div>

        {/* Tab Content: Courses */}
        {activeTab === "courses" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Quản lý khóa học và bài học
              </h2>
              <button
                onClick={() => {
                  resetCourseForm();
                  setShowCourseForm(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 font-semibold"
              >
                <Plus className="w-5 h-5" />
                Thêm khóa học
              </button>
            </div>

            {/* Course Form Modal */}
            {showCourseForm && (
              <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {editingCourse ? "Chỉnh sửa khóa học" : "Thêm khóa học mới"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowCourseForm(false);
                      resetCourseForm();
                    }}
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-2 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tên khóa học
                    </label>
                    <input
                      type="text"
                      value={courseForm.title}
                      onChange={(e) =>
                        setCourseForm({ ...courseForm, title: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Danh mục
                    </label>
                    <input
                      type="text"
                      value={courseForm.category}
                      onChange={(e) =>
                        setCourseForm({
                          ...courseForm,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Trình độ
                    </label>
                    <select
                      value={courseForm.level}
                      onChange={(e) =>
                        setCourseForm({ ...courseForm, level: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    >
                      <option value="Cơ bản">Cơ bản</option>
                      <option value="Trung cấp">Trung cấp</option>
                      <option value="Nâng cao">Nâng cao</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Giá
                    </label>
                    <input
                      type="text"
                      value={courseForm.price}
                      onChange={(e) =>
                        setCourseForm({ ...courseForm, price: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mô tả
                    </label>
                    <textarea
                      value={courseForm.description}
                      onChange={(e) =>
                        setCourseForm({
                          ...courseForm,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      URL hình ảnh
                    </label>
                    <input
                      type="text"
                      value={courseForm.thumbnail}
                      onChange={(e) =>
                        setCourseForm({
                          ...courseForm,
                          thumbnail: e.target.value,
                        })
                      }
                      placeholder="https://..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={
                      editingCourse ? handleUpdateCourse : handleCreateCourse
                    }
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 font-semibold"
                  >
                    <Save className="w-5 h-5" />
                    {editingCourse ? "Cập nhật" : "Tạo mới"}
                  </button>
                  <button
                    onClick={() => {
                      setShowCourseForm(false);
                      resetCourseForm();
                    }}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}

            {/* Courses List */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Tên khóa học
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Danh mục
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Học viên
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Bài học
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {courses.map((course) => {
                      const courseStudents = getCourseStudents(course.id);
                      const courseLessons = getCourseLessons(course.id);
                      return (
                        <tr key={course.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {course.id}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">
                            {course.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                              {course.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                            {courseStudents}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                            {courseLessons}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-3">
                              <button
                                onClick={() => {
                                  setSelectedCourseId(course.id);
                                  resetLessonForm();
                                  setShowLessonForm(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition"
                                title="Thêm bài học"
                              >
                                <Plus className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleEditCourse(course)}
                                className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 p-2 rounded-lg transition"
                                title="Chỉnh sửa"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCourse(course.id)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition"
                                title="Xóa"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Lesson Form Modal */}
            {showLessonForm && (
              <div className="bg-white rounded-2xl shadow-2xl p-8 mt-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {editingLesson ? "Chỉnh sửa bài học" : "Thêm bài học mới"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowLessonForm(false);
                      resetLessonForm();
                    }}
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-2 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Chọn khóa học
                    </label>
                    <select
                      value={selectedCourseId || ""}
                      onChange={(e) =>
                        setSelectedCourseId(Number(e.target.value))
                      }
                      disabled={!!editingLesson}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white disabled:opacity-50"
                    >
                      <option value="">-- Chọn khóa học --</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tên bài học
                    </label>
                    <input
                      type="text"
                      value={lessonForm.title}
                      onChange={(e) =>
                        setLessonForm({ ...lessonForm, title: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      URL Video (YouTube)
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={lessonForm.videoUrl}
                        onChange={(e) =>
                          setLessonForm({
                            ...lessonForm,
                            videoUrl: e.target.value,
                          })
                        }
                        placeholder="https://www.youtube.com/embed/..."
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                      />
                      <button
                        onClick={handleUploadVideo}
                        className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center gap-2 font-semibold"
                        title="Mô phỏng upload video"
                      >
                        <Upload className="w-5 h-5" />
                        Upload
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                      Mô phỏng: Nhập URL YouTube embed (ví dụ:
                      https://www.youtube.com/embed/VIDEO_ID)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Thứ tự
                    </label>
                    <input
                      type="number"
                      value={lessonForm.order}
                      onChange={(e) =>
                        setLessonForm({
                          ...lessonForm,
                          order: Number(e.target.value),
                        })
                      }
                      min={1}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={
                      editingLesson ? handleUpdateLesson : handleCreateLesson
                    }
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 font-semibold"
                  >
                    <Save className="w-5 h-5" />
                    {editingLesson ? "Cập nhật" : "Tạo mới"}
                  </button>
                  <button
                    onClick={() => {
                      setShowLessonForm(false);
                      resetLessonForm();
                    }}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}

            {/* Lessons List */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                Danh sách bài học
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Khóa học
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Tên bài học
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Thứ tự
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {lessons.map((lesson) => {
                      // Handle both string and number courseId
                      const lessonCourseId = typeof lesson.courseId === 'string' ? Number(lesson.courseId) : lesson.courseId;
                      const course = courses.find((c) => {
                        const courseIdNum = typeof c.id === 'string' ? Number(c.id) : c.id;
                        return courseIdNum === lessonCourseId;
                      });
                      return (
                        <tr key={lesson.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {lesson.id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                              {course?.title || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">
                            {lesson.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                            {lesson.order}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleEditLesson(lesson)}
                                className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 p-2 rounded-lg transition"
                                title="Chỉnh sửa"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteLesson(lesson.id)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition"
                                title="Xóa"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Students */}
        {activeTab === "students" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Quản lý học viên và điểm quiz
              </h2>
            </div>

            {/* Students List */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <h3 className="text-xl font-bold text-gray-900">
                  Danh sách học viên
                </h3>
                <button
                  onClick={() => {
                    resetStudentForm();
                    setShowStudentForm(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  Thêm học viên
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Tên học viên
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Mã học viên
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Khóa học đã đăng ký
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Điểm quiz TB
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {students.map((student) => {
                      const studentEnrollments = enrollments.filter(
                        (e) => {
                          const enrollmentUserId = typeof e.userId === 'string' ? Number(e.userId) : e.userId;
                          const studentIdNum = typeof student.id === 'string' ? Number(student.id) : student.id;
                          return enrollmentUserId === studentIdNum || String(e.userId) === String(student.id);
                        }
                      );
                      const avgScore = getAverageQuizScore(student.id);
                      return (
                        <tr key={student.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {student.id}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">
                            {student.fullName || student.username}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {student.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                              {student.studentCode || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                              {studentEnrollments.length} khóa học
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`font-bold px-3 py-1 rounded-full ${avgScore >= 80
                                ? "text-green-700 bg-green-100"
                                : avgScore >= 60
                                  ? "text-yellow-700 bg-yellow-100"
                                  : "text-red-700 bg-red-100"
                                }`}
                            >
                              {avgScore > 0 ? `${avgScore}%` : "Chưa có"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleEditStudent(student)}
                                className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 p-2 rounded-lg transition"
                                title="Chỉnh sửa"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(student.id)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition"
                                title="Xóa"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Student Form Modal */}
            {showStudentForm && (
              <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {editingStudent ? "Chỉnh sửa học viên" : "Thêm học viên mới"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowStudentForm(false);
                      resetStudentForm();
                    }}
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-2 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tên đăng nhập
                    </label>
                    <input
                      type="text"
                      value={studentForm.username}
                      onChange={(e) =>
                        setStudentForm({ ...studentForm, username: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={studentForm.email}
                      onChange={(e) =>
                        setStudentForm({ ...studentForm, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      value={studentForm.fullName}
                      onChange={(e) =>
                        setStudentForm({ ...studentForm, fullName: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mã học viên
                    </label>
                    <input
                      type="text"
                      value={studentForm.studentCode}
                      onChange={(e) =>
                        setStudentForm({ ...studentForm, studentCode: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      value={studentForm.phone}
                      onChange={(e) =>
                        setStudentForm({ ...studentForm, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={editingStudent ? handleUpdateStudent : handleCreateStudent}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 font-semibold"
                  >
                    <Save className="w-5 h-5" />
                    {editingStudent ? "Cập nhật" : "Tạo mới"}
                  </button>
                  <button
                    onClick={() => {
                      setShowStudentForm(false);
                      resetStudentForm();
                    }}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}

            {/* Quiz Results */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <h3 className="text-xl font-bold text-gray-900">
                  Điểm quiz của học viên
                </h3>
                <button
                  onClick={() => {
                    resetQuizResultForm();
                    setShowQuizResultForm(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  Thêm điểm quiz
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Học viên
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Bài quiz
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Điểm số
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Đúng/Tổng
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Ngày nộp
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {quizResults.map((result) => {
                      const student = students.find(
                        (s) => {
                          const studentIdNum = typeof s.id === 'string' ? Number(s.id) : s.id;
                          const resultUserIdNum = typeof result.userId === 'string' ? Number(result.userId) : result.userId;
                          return studentIdNum === resultUserIdNum || String(s.id) === String(result.userId);
                        }
                      );
                      // Find quiz from quizzes array
                      const quiz = quizzes.find(
                        (q) => {
                          const quizIdNum = typeof q.id === 'string' ? Number(q.id) : q.id;
                          const resultQuizIdNum = typeof result.quizId === 'string' ? Number(result.quizId) : result.quizId;
                          return quizIdNum === resultQuizIdNum || String(q.id) === String(result.quizId);
                        }
                      );
                      return (
                        <tr key={result.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">
                            {student?.fullName || student?.username || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {quiz?.title || result.quiz?.title || `Quiz #${result.quizId}`}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`font-bold px-3 py-1 rounded-full ${result.score >= 80
                                ? "text-green-700 bg-green-100"
                                : result.score >= 60
                                  ? "text-yellow-700 bg-yellow-100"
                                  : "text-red-700 bg-red-100"
                                }`}
                            >
                              {result.score}%
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                            {result.correct}/{result.total}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(result.submittedAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleEditQuizResult(result)}
                                className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 p-2 rounded-lg transition"
                                title="Chỉnh sửa"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteQuizResult(result.id)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition"
                                title="Xóa"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quiz Result Form Modal */}
            {showQuizResultForm && (
              <div className="bg-white rounded-2xl shadow-2xl p-8 mt-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {editingQuizResult ? "Chỉnh sửa điểm quiz" : "Thêm điểm quiz mới"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowQuizResultForm(false);
                      resetQuizResultForm();
                    }}
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg p-2 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {!editingQuizResult && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Học viên
                        </label>
                        <select
                          value={quizResultForm.userId}
                          onChange={(e) =>
                            setQuizResultForm({ ...quizResultForm, userId: Number(e.target.value) })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                        >
                          <option value={0}>Chọn học viên</option>
                          {students.map((student) => (
                            <option key={student.id} value={typeof student.id === 'string' ? Number(student.id) : student.id}>
                              {student.fullName || student.username}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Bài quiz
                        </label>
                        <select
                          value={quizResultForm.quizId}
                          onChange={(e) =>
                            setQuizResultForm({ ...quizResultForm, quizId: Number(e.target.value) })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                        >
                          <option value={0}>Chọn bài quiz</option>
                          {quizzes.map((quiz) => (
                            <option key={quiz.id} value={quiz.id}>
                              {quiz.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Điểm số (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={quizResultForm.score}
                      onChange={(e) =>
                        setQuizResultForm({ ...quizResultForm, score: Number(e.target.value) })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Số câu đúng
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={quizResultForm.correct}
                      onChange={(e) =>
                        setQuizResultForm({ ...quizResultForm, correct: Number(e.target.value) })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tổng số câu
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quizResultForm.total}
                      onChange={(e) =>
                        setQuizResultForm({ ...quizResultForm, total: Number(e.target.value) })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={editingQuizResult ? handleUpdateQuizResult : handleCreateQuizResult}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 font-semibold"
                  >
                    <Save className="w-5 h-5" />
                    {editingQuizResult ? "Cập nhật" : "Tạo mới"}
                  </button>
                  <button
                    onClick={() => {
                      setShowQuizResultForm(false);
                      resetQuizResultForm();
                    }}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Reports */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Báo cáo và thống kê
              </h2>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-800">
                    Tổng lượt xem
                  </h3>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-2">
                  {getTotalViews()}
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  Tổng số lượt đăng ký khóa học
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-800">
                    Tỉ lệ hoàn thành TB
                  </h3>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-2">
                  {getAverageCompletionRate()}%
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  Tỉ lệ hoàn thành trung bình các khóa học
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-800">
                    Tổng bài quiz
                  </h3>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-2">
                  {quizzes.length}
                </p>
                <p className="text-sm text-gray-600 font-medium">
                  Tổng số bài quiz hiện có
                </p>
              </div>
            </div>

            {/* Course Reports */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                Báo cáo chi tiết theo khóa học
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Khóa học
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Lượt xem
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Tỉ lệ hoàn thành
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {courses.map((course) => {
                      const views = getCourseViews(course.id);
                      const completionRate = getCompletionRate(course.id);
                      // Use course.lessons from API or count from lessons array
                      return (
                        <tr key={course.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">
                            {course.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                            {views}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-gray-900">
                                {completionRate}%
                              </span>
                              <div className="flex-1 bg-gray-200 rounded-full h-3 max-w-[120px] overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                                  style={{ width: `${completionRate}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  );
}
