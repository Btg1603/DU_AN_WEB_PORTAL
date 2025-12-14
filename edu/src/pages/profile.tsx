import React, { useEffect, useRef, useState } from "react";
import { Camera, User } from "lucide-react";
import FooterComponent from "../components/footer";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/navbar";

export default function NaukriProfilePage() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthday: "",
    phone: "",
    studentCode: "",
  });
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [pwdForm, setPwdForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        birthday: user.birthday || "",
        phone: user.phone || "",
        studentCode: user.studentCode || "",
      });
      setAvatarUrl(user.avatar || "");
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarClick = () => {
    if (!isEditing) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setMessage("Email không hợp lệ!");
      return false;
    }
    if (formData.phone && !/^[0-9\s\-+()]+$/.test(formData.phone)) {
      setMessage("Số điện thoại không hợp lệ!");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!user) return;

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const fullName =
        formData.lastName || formData.firstName
          ? `${formData.lastName} ${formData.firstName}`.trim()
          : user.fullName || user.username;

      await updateProfile({
        ...formData,
        avatar: avatarUrl,
        fullName,
      });

      setMessage("✅ Cập nhật thông tin thành công!");
      setTimeout(() => {
        setIsEditing(false);
        setMessage("");
      }, 2000);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? `❌ ${error.message}`
          : "❌ Có lỗi xảy ra khi cập nhật, vui lòng thử lại."
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!user) return;
    setPwdError("");
    setPwdSuccess("");

    if (!pwdForm.current || !pwdForm.next || !pwdForm.confirm) {
      setPwdError("Vui lòng điền đầy đủ các trường.");
      return;
    }
    if (pwdForm.next.length < 6) {
      setPwdError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }
    if (pwdForm.next !== pwdForm.confirm) {
      setPwdError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (user.password && pwdForm.current !== user.password) {
      setPwdError("Mật khẩu hiện tại không đúng.");
      return;
    }

    setPwdSaving(true);
    try {
      await updateProfile({ password: pwdForm.next });
      setPwdSuccess("Đổi mật khẩu thành công!");
      setPwdForm({ current: "", next: "", confirm: "" });
    } catch (error) {
      setPwdError(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi đổi mật khẩu."
      );
    } finally {
      setPwdSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Hồ sơ của bạn
              </h1>
              <p className="text-gray-600 text-sm">
                Quản lý thông tin cá nhân và ảnh đại diện cho tài khoản{" "}
                <span className="font-semibold text-gray-800">
                  {user?.username}
                </span>
              </p>
            </div>
            <div className="flex gap-3">
              <button
                className="px-5 py-3 rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
                onClick={() => {
                  if (isEditing && user) {
                    // Reset form về giá trị ban đầu khi hủy
                    setFormData({
                      firstName: user.firstName || "",
                      lastName: user.lastName || "",
                      email: user.email || "",
                      birthday: user.birthday || "",
                      phone: user.phone || "",
                      studentCode: user.studentCode || "",
                    });
                    setAvatarUrl(user.avatar || "");
                    setMessage("");
                  }
                  setIsEditing((prev) => !prev);
                }}
              >
                {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa thông tin"}
              </button>
              <button
                onClick={handleSave}
                disabled={!isEditing || saving}
                className={`px-6 py-3 rounded-lg font-semibold text-white transition ${isEditing && !saving
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-gray-300 cursor-not-allowed"
                  }`}
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>

          {/* Profile Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Avatar */}
              <div className="lg:col-span-1">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Ảnh đại diện
                </h3>
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-white" />
                      )}
                    </div>
                    <button
                      onClick={handleAvatarClick}
                      type="button"
                      disabled={!isEditing}
                      className={`absolute bottom-2 right-2 w-10 h-10 rounded-full flex items-center justify-center transition shadow-lg ${isEditing
                          ? "bg-gray-700 hover:bg-gray-800 text-white"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Kích thước ảnh nhỏ nhất: 200 x 200px, định dạng PNG hoặc JPG
                  </p>
                </div>
              </div>

              {/* Right Column - Form Fields */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-bold text-gray-800 mb-6">
                  Thông tin cá nhân
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã học viên
                    </label>
                    <input
                      type="text"
                      name="studentCode"
                      value={formData.studentCode}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {message && (
                  <div
                    className={`mt-6 p-4 rounded-lg text-sm text-center ${message.includes("✅")
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : message.includes("❌")
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-gray-50 text-gray-600"
                      }`}
                  >
                    {message}
                  </div>
                )}

                {/* Change Password Section */}
                <div className="mt-10 border-t pt-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        Bảo mật tài khoản
                      </h3>
                      <p className="text-sm text-gray-500">
                        Đổi mật khẩu để bảo vệ tài khoản tốt hơn.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswordForm((prev) => !prev)
                      }
                      className="px-6 py-3 rounded-lg font-semibold text-white bg-orange-500 hover:bg-orange-600"
                    >
                      Đổi mật khẩu
                    </button>
                  </div>

                  {showPasswordForm && (
                    <div className="mt-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mật khẩu hiện tại
                          </label>
                          <input
                            type="password"
                            value={pwdForm.current}
                            onChange={(e) =>
                              setPwdForm({
                                ...pwdForm,
                                current: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mật khẩu mới
                          </label>
                          <input
                            type="password"
                            value={pwdForm.next}
                            onChange={(e) =>
                              setPwdForm({
                                ...pwdForm,
                                next: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Xác nhận mật khẩu
                          </label>
                          <input
                            type="password"
                            value={pwdForm.confirm}
                            onChange={(e) =>
                              setPwdForm({
                                ...pwdForm,
                                confirm: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="text-sm">
                          {pwdError && (
                            <p className="text-red-500 mb-1">{pwdError}</p>
                          )}
                          {pwdSuccess && (
                            <p className="text-emerald-600 mb-1">
                              {pwdSuccess}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handlePasswordSubmit}
                          disabled={pwdSaving}
                          className={`px-6 py-3 rounded-lg font-semibold text-white self-end ${pwdSaving
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-orange-500 hover:bg-orange-600"
                            }`}
                        >
                          {pwdSaving
                            ? "Đang đổi mật khẩu..."
                            : "Lưu mật khẩu mới"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <FooterComponent />
    </div>
  );
}
