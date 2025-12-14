import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
// ĐẢM BẢO CÁC TYPES NÀY ĐÃ ĐƯỢC ĐỊNH NGHĨA CHÍNH XÁC TRONG FILE types/user.ts
import {
  RegisterPayload,
  UpdateProfilePayload,
  UserProfile,
} from "../types/user";

// Khai báo kiểu dữ liệu cho response từ Login/Register
interface AuthResponse {
  token: string;
  user: UserProfile;
}

// Khai báo kiểu dữ liệu cho dữ liệu lưu trữ
interface AuthData {
  user: UserProfile;
  token: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  isHydrating: boolean;
  // Backend sử dụng email để đăng nhập
  login: (email: string, password: string) => Promise<void>; 
  register: (payload: RegisterPayload) => Promise<void>;
  updateProfile: (updates: UpdateProfilePayload) => Promise<void>;
  logout: () => void;
  // Thêm getter cho token để sử dụng bên ngoài Context (nếu cần)
  getToken: () => string | null; 
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// SỬA CỔNG MẶC ĐỊNH SANG 5000
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
// KEY LƯU TRỮ CHỨA CẢ USER VÀ TOKEN
const STORAGE_KEY = "naukri:auth_data";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  // ----------------------------------------------------
  // 1. HYDRATION (TẢI DỮ LIỆU TỪ LOCAL STORAGE KHI LOAD)
  // ----------------------------------------------------
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setAuthData(JSON.parse(raw));
      }
    } catch (error) {
      console.error("Failed to hydrate auth state", error);
      // Xóa dữ liệu lỗi
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsHydrating(false);
    }
  }, []);

  // ----------------------------------------------------
  // 2. HÀM PERSIST (LƯU VÀO LOCAL STORAGE)
  // ----------------------------------------------------
  const persistAuthData = useCallback((data: AuthData | null) => {
    if (data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    setAuthData(data);
  }, []);

  // ----------------------------------------------------
  // 3. HÀM GET TOKEN CHO REQUEST BẢO VỆ
  // ----------------------------------------------------
  const getToken = useCallback(() => {
      return authData?.token ?? null;
  }, [authData]);


  // ----------------------------------------------------
  // 4. HÀM LOGIN (SỬ DỤNG POST VÀ NHẬN JWT)
  // ----------------------------------------------------
  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }), // Backend dùng email
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Email hoặc mật khẩu không đúng");
    }

    const result: AuthResponse = await response.json();
    
    // Lưu Token và User Profile
    persistAuthData({ user: result.user, token: result.token });

  }, [persistAuthData]);

  // ----------------------------------------------------
  // 5. HÀM REGISTER (SỬ DỤNG POST)
  // ----------------------------------------------------
  const register = useCallback(
    async (payload: RegisterPayload) => {
      // Backend sẽ tự xử lý kiểm tra tồn tại và hash password.
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload, // username, email, password
          role: "user",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể đăng ký. Vui lòng thử lại");
      }
      
      // Tùy chọn: Sau khi đăng ký thành công, tự động đăng nhập (gọi login)
      // Nếu API trả về token và user, bạn có thể gọi persistAuthData tương tự như login.
      const result: AuthResponse = await response.json();
      persistAuthData({ user: result.user, token: result.token });

    },
    [persistAuthData]
  );

  // ----------------------------------------------------
  // 6. HÀM UPDATE PROFILE (SỬ DỤNG TOKEN)
  // ----------------------------------------------------
  const updateProfile = useCallback(
    async (updates: UpdateProfilePayload) => {
      if (!authData) {
        throw new Error("Bạn cần đăng nhập để cập nhật thông tin");
      }

      const token = authData.token;
      
      // Lưu ý: Endpoint này phải được bảo vệ bởi middleware xác thực JWT
      const response = await fetch(`${API_URL}/api/users/${authData.user.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // THÊM XÁC THỰC
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể cập nhật thông tin. Vui lòng thử lại sau.");
      }

      const updatedUser: UserProfile = await response.json();
      // Cập nhật AuthData mới
      persistAuthData({ user: updatedUser, token });
    },
    [authData, persistAuthData]
  );

  // ----------------------------------------------------
  // 7. HÀM LOGOUT
  // ----------------------------------------------------
  const logout = useCallback(() => {
    persistAuthData(null);
  }, [persistAuthData]);

  const value = useMemo(
    () => ({
      user: authData ? authData.user : null,
      isHydrating,
      login,
      register,
      updateProfile,
      logout,
      getToken,
    }),
    [authData, isHydrating, login, register, updateProfile, logout, getToken]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được dùng trong AuthProvider");
  }
  return context;
}