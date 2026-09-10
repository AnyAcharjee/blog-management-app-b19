const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function request(path, { method = "GET", token, body, params } = {}) {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    });
  }

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const headers = {};
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(url.toString(), {
      method,
      headers,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    const error = new Error("Unable to reach the server. Please check your connection and try again.");
    error.status = 0;
    throw error;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || data.error || "Something went wrong. Please try again.");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const authApi = {
  login: (email, password) =>
    request("/api/auth/login", { method: "POST", body: { email, password } }),
  register: (payload) => request("/api/auth/register", { method: "POST", body: payload }),
  forgotPassword: (email) =>
    request("/api/auth/forgot-password", { method: "POST", body: { email } }),
  resetPassword: (token, password) =>
    request(`/api/auth/reset-password/${token}`, { method: "PATCH", body: { password } }),
};

export const usersApi = {
  getProfile: (token) => request("/api/users/profile", { token }),
  updateProfile: (token, payload) =>
    request("/api/users/profile/update", { method: "PUT", token, body: payload }),
  updatePassword: (token, password) =>
    request("/api/users/password", { method: "PATCH", token, body: { password } }),
  uploadProfileImage: (token, file) => {
    const formData = new FormData();
    formData.append("image", file);
    return request("/api/users/profile/image", { method: "PATCH", token, body: formData });
  },
  getUsers: (token) => request("/api/users", { token }),
  getUserById: (token, id) => request(`/api/users/${id}`, { token }),
  updateUserStatus: (token, id, isActive) =>
    request(`/api/users/${id}/status`, { method: "PATCH", token, body: { isActive } }),
};

export const blogsApi = {
  getAll: ({ title, category } = {}) => request("/api/blogs", { params: { title, category } }),
  getById: (id) => request(`/api/blogs/${id}`),
  create: (token, payload) => request("/api/blogs/create", { method: "POST", token, body: payload }),
  update: (token, id, payload) =>
    request(`/api/blogs/update/${id}`, { method: "PUT", token, body: payload }),
  remove: (token, id) => request(`/api/blogs/${id}`, { method: "DELETE", token }),
};

export function resolveImageUrl(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
  return `${API_BASE_URL}${imagePath}`;
}

export function getErrorMessage(err) {
  if (err && typeof err.message === "string" && err.message) return err.message;
  return "Something went wrong. Please try again.";
}

export { API_BASE_URL };
