import { useEffect, useState } from "react";
import { ClipboardList, CheckCircle, XCircle, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/navbar";
import ContactFooter from "../components/footer";

interface QuizResult {
  id: string;
  userId: number;
  quizId: number;
  score: number;
  correct: number;
  total: number;
  submittedAt: string;
  quiz?: {
    id: number;
    title: string;
    courseId: number;
  };
  course?: {
    id: number;
    title: string;
  };
}

export default function QuizResultsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const [resultsRes, quizzesRes, coursesRes] = await Promise.all([
          apiGet<QuizResult[]>(`/quizResults?userId=${user.id}`),
          apiGet<Array<{ id: number; title: string; courseId: number }>>("/quizzes"),
          apiGet<Array<{ id: number; title: string }>>("/courses"),
        ]);

        const quizMap = new Map(quizzesRes.map((q) => [q.id, q]));
        const courseMap = new Map(coursesRes.map((c) => [c.id, c]));

        const resultsWithInfo = resultsRes.map((result) => {
          const quiz = quizMap.get(result.quizId);
          const course = quiz ? courseMap.get(quiz.courseId) : undefined;
          return {
            ...result,
            quiz,
            course,
          };
        });

        // Sort by submittedAt descending (newest first)
        resultsWithInfo.sort(
          (a, b) =>
            new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );

        setResults(resultsWithInfo);
      } catch (err) {
        console.error(err);
        setError("Không thể tải lịch sử điểm");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-white p-12 rounded-2xl shadow-xl border border-gray-200">
            <p className="text-gray-600 font-semibold text-lg">Vui lòng đăng nhập để xem điểm</p>
          </div>
        </div>
        <ContactFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Hero Section */}
        <div className="relative mb-12 py-12 px-8 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-pink-600/10 rounded-3xl border border-gray-200 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Lịch sử điểm kiểm tra
            </h1>
            <p className="text-lg text-gray-600">
              Xem lại tất cả các bài kiểm tra bạn đã làm
            </p>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Đang tải lịch sử điểm...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {!loading && !error && results.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200">
            <ClipboardList className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <p className="text-gray-600 text-xl font-semibold mb-2">
              Bạn chưa làm bài kiểm tra nào
            </p>
            <button
              onClick={() => navigate("/quizzes")}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Làm bài kiểm tra ngay
            </button>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="space-y-6">
            {results.map((result) => (
              <div
                key={result.id}
                className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <ClipboardList className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {result.quiz?.title || "Bài kiểm tra"}
                        </h3>
                        {result.course && (
                          <p className="text-sm text-gray-600 mt-1 font-medium">
                            Khóa học: <span className="text-blue-600">{result.course.title}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-4 flex-wrap">
                      <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="font-medium">
                          {new Date(result.submittedAt).toLocaleDateString("vi-VN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-gray-700 font-semibold">
                          Đúng: <span className="text-green-600 font-bold">{result.correct}</span>/
                          {result.total} câu
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => navigate(`/quiz/${result.quizId}`)}
                        className="text-blue-600 hover:text-purple-600 font-semibold text-sm transition-colors flex items-center gap-2"
                      >
                        Xem lại bài kiểm tra
                        <span>→</span>
                      </button>
                    </div>
                  </div>

                  <div
                    className={`px-8 py-6 rounded-2xl ${getScoreBgColor(
                      result.score
                    )} flex flex-col items-center justify-center min-w-[120px] shadow-lg border-2 ${
                      result.score >= 80
                        ? "border-green-300"
                        : result.score >= 60
                        ? "border-yellow-300"
                        : "border-red-300"
                    }`}
                  >
                    <span className="text-xs text-gray-600 mb-2 font-semibold uppercase tracking-wide">Điểm số</span>
                    <span
                      className={`text-4xl font-bold ${getScoreColor(result.score)}`}
                    >
                      {result.score}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="mt-10 bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Thống kê tổng quan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
                <p className="text-4xl font-bold text-blue-600 mb-2">
                  {results.length}
                </p>
                <p className="text-sm text-gray-700 font-semibold">Tổng số bài đã làm</p>
              </div>
              <div className="text-center bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200">
                <p className="text-4xl font-bold text-green-600 mb-2">
                  {results.filter((r) => r.score >= 80).length}
                </p>
                <p className="text-sm text-gray-700 font-semibold">Bài đạt điểm tốt (≥80%)</p>
              </div>
              <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200">
                <p className="text-4xl font-bold text-purple-600 mb-2">
                  {results.length > 0
                    ? Math.round(
                        results.reduce((sum, r) => sum + r.score, 0) /
                          results.length
                      )
                    : 0}
                  %
                </p>
                <p className="text-sm text-gray-700 font-semibold">Điểm trung bình</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <ContactFooter />
    </div>
  );
}



