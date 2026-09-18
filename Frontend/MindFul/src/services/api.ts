import axios from "axios";

// ============================================================
// AXIOS INSTANCE
// ============================================================
const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API_BASE_URL}/users`,
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
      url.includes("/login") ||
      url.includes("/register") ||
      url.includes("/forgot-password") ||
      url.includes("/reset-password");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// ============================================================
// USER AUTH API ENDPOINT
// ============================================================
export const userApi = {
  register: (data: {
    email: string;
    password: string;
  }) => api.post("/register", data),

  login: (data: {
    email: string;
    password: string;
  }) => api.post("/login", data),

  forgotPassword: (data: {
    email: string;
  }) => api.post("/forgot-password", data),

  resetPassword: (data: {
    token: string;
    newPassword: string;
  }) => api.post("/reset-password", data),

  getProfile: () => api.get("/profile"),
};

// ============================================================
// DASHBOARD API ENDPOINT
// ============================================================
export const dashboardApi = {
  getAll: () => api.get("/dashboard"),
};

// ============================================================
// DAILY JOURNAL CREATE ENDPOINT
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
  }) => api.post("/daily-journal", data),
};

// ============================================================
// HISTORY API ENDPOINT
// ============================================================
export const historyApi = {
  getAll: () => api.get("/history"),
};

// ============================================================
// AI ASSISTANT API ENDPOINT
// ============================================================
export const aiAssistantApi = {
  chat: (data: {
    message: string;
  }) => api.post("/ai-assistant", data),
};

export default api;