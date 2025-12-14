import { Bell, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserMenu from "./UserMenu";

export default function Navbar() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const displayName = user?.fullName || user?.username || "Học viên";

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo + Menu */}
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xl font-bold">N</span>
                        </div>
                        <span className="text-xl font-bold text-gray-800">Naukri</span>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <button
                            type="button"
                            onClick={() => navigate("/homepage")}
                            className="flex items-center gap-2 text-gray-700 hover:text-blue-500 transition font-medium"
                        >
                            <Home className="w-4 h-4" />
                            <span>Trang chủ</span>
                        </button>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Xin chào</p>
                        <p className="text-base font-semibold text-gray-800">
                            {displayName}
                        </p>
                    </div>
                    <button
                        className="px-4 py-2 text-gray-700 hover:text-white font-medium transition bg-blue-500 rounded-md cursor-pointer"
                        onClick={() => navigate("/coursepage")}
                    >
                        Khóa học của tôi
                    </button>
                    <button
                        className="px-4 py-2 text-gray-700 font-medium transition border border-blue-200 rounded-md hover:bg-blue-50"
                        onClick={() => navigate("/admin")}
                    >
                        Quản trị
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition">
                        <Bell className="w-5 h-5 text-gray-600" />
                    </button>
                    <UserMenu />
                </div>
            </div>
        </nav>
    );
}

