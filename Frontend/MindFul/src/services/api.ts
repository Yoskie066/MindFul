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
// RESPONSE INTERCEPTOR 
// ============================================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const isAuthEndpoint =
      url.includes("/users/login") ||
      url.includes("/users/register") ||
      url.includes("/users/forgot-password") ||
      url.includes("/users/reset-password");

  
    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// ============================================================
// USER AUTH API ENDPOINTS
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

// ============================================================
// DASHBOARD API ENDPOINT
// ============================================================
export const dashboardApi = {
  getAll: () => api.get("/users/dashboard"),
};

// ============================================================
// DAILY JOURNAL CREATE ENDPOINTS
// ============================================================
export const journalApi = {
  create: (data: {
    mood: string;
    moodEmoji: string;
    moodColor: string;
    dateTime: string;
    feeling: string;
    stressLevel: number;
    energyLevel: number;
    sleepHours: number;
    tags: string[];
  }) => api.post("/users/daily-journal", data),
};

// ============================================================
// HISTORY API ENDPOINT
// ============================================================
export const historyApi = {
  getAll: () => api.get("/users/history"),
};

// ============================================================
// AI ASSISTANT API ENDPOINT
// ============================================================
export const aiAssistantApi = {
  chat: (data: {
    message: string;
  }) =>
    api.post("/users/ai-assistant", data),
};

export default api;