import React from "react";
import {
  BookOpen,
  GraduationCap,
  ClipboardList,
  Users,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ContactFooter from "../components/footer";
import Navbar from "../components/navbar";

export default function NaukriHomepage() {
  const navigate = useNavigate();
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
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Hệ thống học tập thông minh
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Nền tảng học tập trực tuyến hiện đại, giúp bạn phát triển kỹ năng và kiến thức một cách hiệu quả
            </p>
          </div>
        </div>
      </section>

      {/* Learning System Section */}
      <section className="py-16 px-6 -mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Khám phá các tính năng
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chọn một trong các dịch vụ học tập của chúng tôi để bắt đầu hành trình học tập của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LMS Card */}
            <div className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  LMS
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Nền tảng quản lý học tập trực tuyến giúp tổ chức theo dõi, báo
                  cáo, quản trị các nội dung học tập, vận hành hiệu quả
                </p>
                <div className="flex items-center text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Tìm hiểu thêm</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* E-Learning Card */}
            <div 
              className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative overflow-hidden"
              onClick={() => navigate("/coursepage")}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                  E-Learning
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Phương pháp học linh hoạt thông qua các thiết bị kết nối với
                  Internet, sử dụng tài nguyên kỹ thuật số cho việc học
                </p>
                <div className="flex items-center text-purple-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Khám phá ngay</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Bài kiểm tra Card */}
            <div
              className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative overflow-hidden"
              onClick={() => navigate("/quizzes")}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <ClipboardList className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                  Bài kiểm tra
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Các bài kiểm tra được thiết kế kỹ càng giúp sinh viên và nhà
                  tuyển dụng đánh giá năng lực trong một kỹ năng cụ thể
                </p>
                <div className="flex items-center text-green-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Bắt đầu kiểm tra</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Quản lý đào tạo Card */}
            <div className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
                  Quản lý đào tạo
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Công cụ tạo và quản lý các bài kiểm tra trực tuyến, giúp giảng
                  viên dễ dàng tạo đề kiểm tra với nhiều định dạng khác nhau
                </p>
                <div className="flex items-center text-orange-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Tìm hiểu thêm</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <ContactFooter />
    </div>
  );
}
