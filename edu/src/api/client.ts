// api.ts (ĐÃ SỬA ĐỔI)

// 1. SỬA CỔNG MẶC ĐỊNH SANG 5000 (Nếu không có biến môi trường VITE_API_URL)
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

// --- HÀM HỖ TRỢ LẤY TOKEN (Giả sử bạn lưu token trong Local Storage) ---
function getAuthHeader() {
  const token = localStorage.getItem('token'); // Thay 'token' bằng key bạn dùng để lưu JWT
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// --- HÀM GET (Đã thêm Header cho các endpoint cần Auth) ---
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      // Kết hợp các headers (Content-Type không cần cho GET, nhưng Authorization thì có thể)
      ...getAuthHeader(), 
    },
  });
  if (!res.ok) throw new Error("Lỗi khi gọi API");
  return res.json();
}

// --- HÀM POST (Đã thêm Header Content-Type và Auth) ---
export async function apiPost<T>(path: string, body: unknown, needsAuth: boolean = true): Promise<T> {
  const headers = { 
    "Content-Type": "application/json",
    ...(needsAuth ? getAuthHeader() : {}) // Chỉ thêm Auth nếu cần (Ví dụ: Đăng ký/Đăng nhập thì không cần)
  };

  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: headers as HeadersInit,
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Lỗi khi gửi dữ liệu");
  return res.json();
}

// --- HÀM PUT (Đã thêm Header Content-Type và Auth) ---
export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers: { 
        "Content-Type": "application/json",
        ...getAuthHeader() // Thêm Auth header
    } as HeadersInit,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Lỗi khi cập nhật dữ liệu");
  return res.json();
}

// --- HÀM DELETE (Đã thêm Auth) ---
export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${API_URL}${path}`, { 
    method: "DELETE",
    headers: getAuthHeader() as HeadersInit // Thêm Auth header
  });
  if (!res.ok) throw new Error("Lỗi khi xoá dữ liệu");
}