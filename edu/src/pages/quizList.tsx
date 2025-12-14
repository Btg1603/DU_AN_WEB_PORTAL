import React, { useEffect, useState } from "react";
import { ClipboardList, BookOpen, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../api/client";
import ContactFooter from "../components/footer";
import Navbar from "../components/navbar";

interface Quiz {
  id: number;
  courseId: number;
  title: string;
  questions: { id: number; question: string }[];
}

interface ApiCourse {
  id: number;
  title: string;
  level: string;
}

interface QuizWithCourse extends Quiz {
  course?: ApiCourse;
}

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<QuizWithCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, courseRes] = await Promise.all([
          apiGet<Quiz[]>("/quizzes"),
          apiGet<ApiCourse[]>("/courses"),
        ]);
        const courseMap = new Map(courseRes.map((c) => [c.id, c]));
        const merged = quizRes.map<QuizWithCourse>((q) => ({
          ...q,
          course: courseMap.get(q.courseId),
        }));
        setQuizzes(merged);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách bài kiểm tra");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Navbar */}
      <Navbar />

      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="relative mb-12 py-12 px-8 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-pink-600/10 rounded-3xl border border-gray-200 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-2 font-medium">Đánh giá kiến thức</p>
                <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Chọn bài kiểm tra
                </h1>
                <p className="text-gray-600 mt-2">Kiểm tra và đánh giá kiến thức của bạn</p>
              </div>
              <button
                onClick={() => navigate("/quiz-results")}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Xem điểm của tôi
              </button>
            </div>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Đang tải bài kiểm tra...</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6 text-center">
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <button
                key={quiz.id}
                onClick={() => navigate(`/quiz/${quiz.id}`)}
                className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-left p-6 flex flex-col gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <ClipboardList className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      {quiz.course ? quiz.course.title : "Khoá học"}
                    </p>
                    <h2 className="font-bold text-gray-900 line-clamp-2 text-lg group-hover:text-blue-600 transition-colors">
                      {quiz.title}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-lg">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-gray-700">{quiz.questions?.length ?? 0} câu hỏi</span>
                  </div>
                  <span className="inline-flex items-center gap-2 text-blue-600 font-bold group-hover:text-purple-600 transition-colors">
                    Làm bài
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </button>
            ))}
          </div>

          {!loading && !error && quizzes.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
              <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">
                Hiện chưa có bài kiểm tra nào.
              </p>
            </div>
          )}
        </div>
      </div>
      <ContactFooter />
    </div>
  );
}


