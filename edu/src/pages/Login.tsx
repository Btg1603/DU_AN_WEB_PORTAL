import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NaukriLogin() {
const [email, setEmail] = useState(""); 
const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const nav = useNavigate();
  const { login } = useAuth();
  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop",
      title: "Kho học tài miễn phí",
      subtitle:
        "Mọi chủ đề bạn quan tâm, từ công việc đến cuộc sống trong tầm tay bạn",
    },
    {
      image:
        "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=800&h=600&fit=crop",
      title: "Học tập hiệu quả",
      subtitle: "Nâng cao kỹ năng nghề nghiệp của bạn",
    },
    {
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
      title: "Cộng đồng học tập",
      subtitle: "Kết nối và phát triển cùng nhau",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

const handleSubmit = async () => {
  setError("");

  // SỬA: Kiểm tra email thay vì name
  if (!email || !password) {
    setError("Email/Tên đăng nhập và mật khẩu không được để trống!");
    return;
  }

  setLoading(true);
  try {
    // SỬA: Truyền email thay vì name
    await login(email, password);
    setEmail(""); // SỬA: clear email
    setPassword("");
    nav("/homepage");
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Có lỗi xảy ra khi đăng nhập!");
    }
  }
  setLoading(false);
};

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left Panel - Login Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">N</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">Naukri</span>
            </div>
          </div>

          {/* Login Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Đăng nhập</h2>
            <p className="text-gray-600 text-sm">
              Khám phá kho tàng kiến thức bất tận cùng bộ tài liệu độc quyền với
              Naukri Education
            </p>
          </div>

          {/* Login Form */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tên đăng nhập"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-16"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[70%] -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="text-right">
              <a
                href="#"
                className="text-sm text-blue-500 hover:text-blue-600 transition"
              >
                Quên mật khẩu?
              </a>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition duration-200 shadow-md hover:shadow-lg ${loading ? "cursor-not-allowed opacity-60" : ""
                }`}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <a
              href="register"
              className="text-blue-500 hover:text-blue-600 font-semibold transition cursor-pointer"
            >
              Đăng ký ngay
            </a>
          </div>
        </div>

        {/* Right Panel - Image Slider */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-400 to-blue-600 relative overflow-hidden">
          <div className="relative h-full min-h-[400px] lg:min-h-0">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">{slide.title}</h3>
                  <p className="text-sm opacity-90">{slide.subtitle}</p>
                </div>
              </div>
            ))}

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${index === currentSlide
                      ? "bg-white w-8"
                      : "bg-white/50 hover:bg-white/75"
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
