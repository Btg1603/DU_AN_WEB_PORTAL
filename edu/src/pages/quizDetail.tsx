import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/navbar";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface Quiz {
  id: string;
  courseId: string;
  title: string;
  questions: Question[];
}

export default function QuizDetailPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number } | null>(
    null
  );
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await apiGet<Quiz>(`/quizzes/${quizId}`);
        setQuiz(data);
        if (data) {
          const initial: Record<string, number | null> = {};
          data.questions.forEach((q) => {
            initial[q.id] = null;
          });
          setAnswers(initial);
        }
      } catch (err) {
        console.error(err);
        setError("Không thể tải bài kiểm tra");
      }
    };
    if (quizId) fetchQuiz();
  }, [quizId]);

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (result) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (!quiz || !user) return;
    setSubmitting(true);
    setError("");
    try {
      let correct = 0;
      quiz.questions.forEach((q) => {
        if (answers[q.id] === q.correctIndex) correct += 1;
      });
      const score = Math.round((correct / quiz.questions.length) * 100);
      setResult({ score, total: quiz.questions.length });

      // Không gửi userId - server sẽ lấy từ authenticated user
      await apiPost("/quizResults", {
        quizId: quiz.id,
        score,
        correct,
        total: quiz.questions.length,
        submittedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi nộp bài");
    } finally {
      setSubmitting(false);
    }
  };

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="text-center bg-white p-12 rounded-2xl shadow-xl border border-gray-200">
          {error ? (
            <p className="text-red-600 font-semibold text-lg">{error}</p>
          ) : (
            <>
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Đang tải bài kiểm tra...</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Navbar */}
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 hover:text-blue-700 mb-6 font-semibold flex items-center gap-2 transition-colors"
        >
          <span>←</span>
          <span>Quay lại danh sách bài kiểm tra</span>
        </button>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {quiz.title}
          </h1>
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <p className="text-sm font-semibold text-gray-700">
                {quiz.questions.length} câu hỏi trắc nghiệm
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {quiz.questions.map((q, index) => (
            <div
              key={q.id}
              className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <p className="font-bold text-gray-900 mb-4 text-lg">
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-lg mr-3 text-sm">
                  Câu {index + 1}
                </span>
                {q.question}
              </p>
              <div className="space-y-3">
                {q.options.map((opt, optIndex) => {
                  const selected = answers[q.id] === optIndex;
                  const isCorrect =
                    result && optIndex === q.correctIndex;
                  const isWrong =
                    result && selected && optIndex !== q.correctIndex;
                  return (
                    <button
                      key={optIndex}
                      type="button"
                      onClick={() => handleSelect(q.id, optIndex)}
                      className={`w-full text-left px-5 py-4 rounded-xl border-2 text-sm font-medium transition-all duration-300 ${
                        selected
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                      } ${
                        isCorrect
                          ? "border-emerald-500 bg-emerald-50 shadow-lg"
                          : ""
                      } ${
                        isWrong ? "border-red-500 bg-red-50 shadow-lg" : ""
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
            <p className="text-sm text-red-600 font-semibold">{error}</p>
          </div>
        )}

        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {result && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 rounded-xl border-2 border-green-200">
              <p className="text-base text-gray-800 font-semibold">
                Bạn đúng{" "}
                <span className="text-green-600 font-bold text-lg">
                  {Math.round((result.score / 100) * result.total)}
                </span>{" "}
                / {result.total} câu (
                <span className="text-green-600 font-bold text-lg">{result.score}%</span>)
              </p>
            </div>
          )}
          <button
            type="button"
            disabled={submitting || !!result}
            onClick={handleSubmit}
            className={`px-8 py-4 rounded-xl font-bold text-white self-end transition-all duration-300 shadow-lg ${
              submitting || result
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-0.5"
            }`}
          >
            {result
              ? "Đã nộp bài"
              : submitting
              ? "Đang nộp bài..."
              : "Nộp bài"}
          </button>
        </div>
      </div>
    </div>
  );
}


