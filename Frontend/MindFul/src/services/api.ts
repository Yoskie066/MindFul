import axios from "axios";

// ============================================================
// AXIOS INSTANCE
// ============================================================
const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// REQUEST INTERCEPTOR - Add token to headers
// ============================================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// RESPONSE INTERCEPTOR - Handle errors globally
// ============================================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// ============================================================
// USER API ENDPOINTS
// ============================================================
export const userApi = {
  register: (data: { email: string; password: string }) =>
    api.post("/users/register", data),

  login: (data: { email: string; password: string }) =>
    api.post("/users/login", data),

  forgotPassword: (data: { email: string }) =>
    api.post("/users/forgot-password", data),

  resetPassword: (data: { token: string; newPassword: string }) =>
    api.post("/users/reset-password", data),

  getProfile: () => api.get("/users/profile"),
};

export default api;