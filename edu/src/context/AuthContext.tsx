import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  RegisterPayload,
  UpdateProfilePayload,
  UserProfile,
} from "../types/user";

interface AuthContextValue {
  user: UserProfile | null;
  isHydrating: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  updateProfile: (updates: UpdateProfilePayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
const STORAGE_KEY = "naukri:user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setUser(JSON.parse(raw));
      }
    } catch (error) {
      console.error("Failed to hydrate auth state", error);
    } finally {
      setIsHydrating(false);
    }
  }, []);

  const persistUser = useCallback((data: UserProfile | null) => {
    if (data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const response = await fetch(
      `${API_URL}/user?username=${encodeURIComponent(
        username
      )}&password=${encodeURIComponent(password)}`
    );
    if (!response.ok) {
      throw new Error("Không thể kết nối máy chủ");
    }
    const result: UserProfile[] = await response.json();
    const currentUser = result[0];
    if (!currentUser) {
      throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
    }
    setUser(currentUser);
    persistUser(currentUser);
  }, [persistUser]);

  const register = useCallback(
    async ({ username, email, password }: RegisterPayload) => {
      const existRes = await fetch(
        `${API_URL}/user?username=${encodeURIComponent(username)}`
      );
      if (!existRes.ok) {
        throw new Error("Không thể kiểm tra tài khoản hiện có");
      }
      const existing = await existRes.json();
      if (existing.length) {
        throw new Error("Tên đăng nhập đã tồn tại, vui lòng chọn tên khác");
      }

      const defaultProfile: Omit<UserProfile, "id" | "role"> = {
        username,
        email,
        firstName: "",
        lastName: "",
        fullName: username,
        phone: "",
        studentCode: "",
        birthday: "",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
          username
        )}`,
      };

      const response = await fetch(`${API_URL}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...defaultProfile,
          role: "user",
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Không thể đăng ký. Vui lòng thử lại");
      }
    },
    []
  );

  const updateProfile = useCallback(
    async (updates: UpdateProfilePayload) => {
      if (!user) {
        throw new Error("Bạn cần đăng nhập để cập nhật thông tin");
      }
      
      const updatedData = { ...user, ...updates };
      
      const response = await fetch(`${API_URL}/user/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          response.status === 404
            ? "Không tìm thấy người dùng"
            : response.status === 400
            ? "Dữ liệu không hợp lệ"
            : "Không thể cập nhật thông tin. Vui lòng thử lại sau."
        );
      }

      const updatedUser: UserProfile = await response.json();
      setUser(updatedUser);
      persistUser(updatedUser);
    },
    [user, persistUser]
  );

  const logout = useCallback(() => {
    setUser(null);
    persistUser(null);
  }, [persistUser]);

  const value = useMemo(
    () => ({
      user,
      isHydrating,
      login,
      register,
      updateProfile,
      logout,
    }),
    [user, isHydrating, login, register, updateProfile, logout]
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

