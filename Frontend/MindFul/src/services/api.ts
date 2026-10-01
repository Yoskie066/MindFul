import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API_BASE_URL}/users`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const isAuthEndpoint =
      url.includes("/login") || url.includes("/register") ||
      url.includes("/google-auth") || url.includes("/forgot-password") ||
      url.includes("/reset-password");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const userApi = {
  register: (data: { email: string; password: string }) => api.post("/register", data),
  login: (data: { email: string; password: string }) => api.post("/login", data),
  googleAuth: (accessToken: string) => api.post("/google-auth", { accessToken }),
  logout: () => api.post("/logout"),
  heartbeat: () => api.post("/profile"),
  forgotPassword: (data: { email: string }) => api.post("/forgot-password", data),
  resetPassword: (data: { token: string; newPassword: string }) => api.post("/reset-password", data),
  getProfile: () => api.get("/profile"),
};

export const dashboardApi = { getAll: () => api.get("/dashboard") };
export const journalApi = {
  create: (data: {
    mood: string; moodEmoji: string; moodColor: string; dateTime: string;
    feeling: string; stressLevel: number; energyLevel: number;
    sleepHours: number; tags: string[];
  }) => api.post("/daily-journal", data),
};
export const historyApi = { getAll: () => api.get("/history") };
export const aiAssistantApi = { chat: (data: { message: string }) => api.post("/ai-assistant", data) };

export default api;