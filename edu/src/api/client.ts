// api.ts (ĐÃ SỬA ĐỔI)

// 1. SỬA CỔNG MẶC ĐỊNH SANG 5000 (Nếu không có biến môi trường VITE_API_URL)
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

// --- HÀM HỖ TRỢ LẤY TOKEN (Lấy từ Local Storage - key "naukri:auth_data") ---
function getAuthHeader() {
  try {
    const raw = localStorage.getItem('naukri:auth_data');
    if (raw) {
      const authData = JSON.parse(raw);
      const token = authData.token;
      return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
  } catch (error) {
    console.error("Error reading auth token:", error);
  }
  return {};
}

// --- HÀM GET (Đã thêm Header cho các endpoint cần Auth) ---
export async function apiGet<T>(path: string): Promise<T> {
  const fullPath = path.startsWith('/api') ? path : `/api${path}`;
  const headers = getAuthHeader();
  const res = await fetch(`${API_URL}${fullPath}`, {
    method: "GET",
    headers: headers as HeadersInit,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(`Lỗi khi gọi API: ${res.status} ${JSON.stringify(errorData)}`);
  }
  return res.json();
}

// --- HÀM POST (Đã thêm Header Content-Type và Auth) ---
export async function apiPost<T>(path: string, body: unknown, needsAuth: boolean = true): Promise<T> {
  const fullPath = path.startsWith('/api') ? path : `/api${path}`;
  const headers = { 
    "Content-Type": "application/json",
    ...(needsAuth ? getAuthHeader() : {}) // Chỉ thêm Auth nếu cần (Ví dụ: Đăng ký/Đăng nhập thì không cần)
  };

  console.log('[apiPost]', fullPath, 'body:', body, 'headers:', headers);

  const res = await fetch(`${API_URL}${fullPath}`, {
    method: "POST",
    headers: headers as HeadersInit,
    body: JSON.stringify(body),
  });

  console.log('[apiPost] response status:', res.status);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error('[apiPost] error:', errorData);
    throw new Error(`${res.status} ${JSON.stringify(errorData)}`);
  }
  return res.json();
}

// --- HÀM PUT (Đã thêm Header Content-Type và Auth) ---
export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const fullPath = path.startsWith('/api') ? path : `/api${path}`;
  const res = await fetch(`${API_URL}${fullPath}`, {
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
  const fullPath = path.startsWith('/api') ? path : `/api${path}`;
  const res = await fetch(`${API_URL}${fullPath}`, { 
    method: "DELETE",
    headers: getAuthHeader() as HeadersInit // Thêm Auth header
  });
  if (!res.ok) throw new Error("Lỗi khi xoá dữ liệu");
}