import axios from "axios";

// ============================================================
// AXIOS INSTANCE
// ============================================================
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const admin_Api = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// REQUEST INTERCEPTOR - Add Admin Token
// ============================================================
admin_Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================
admin_Api.interceptors.response.use(
  (response) => response,

  (error) => {
    const url = error.config?.url || "";

    const isAuthEndpoint =
      url.includes("/admin-login") ||
      url.includes("/admin-register") ||
      url.includes("/admin-forgot-password") ||
      url.includes("/admin-reset-password");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");

      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);

// ============================================================
// ADMIN AUTH API ENDPOINT
// ============================================================
export const adminApi = {
  register: (data: {
    email: string;
    password: string;
  }) => admin_Api.post("/admin-register", data),

  login: (data: {
    email: string;
    password: string;
  }) => admin_Api.post("/admin-login", data),

  forgotPassword: (data: {
    email: string;
  }) => admin_Api.post("/admin-forgot-password", data),

  resetPassword: (data: {
    token: string;
    newPassword: string;
  }) => admin_Api.post("/admin-reset-password", data),

  getProfile: () => admin_Api.get("/admin-profile"),
};

export default admin_Api;