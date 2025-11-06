// api.js - Enhanced API service layer
import axios from "axios";

// Base API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/api/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem("token", access);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Handle network errors
    if (!error.response) {
      error.message = "Network error. Please check your internet connection.";
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const message = error.response.data?.message || error.response.data?.detail || "An error occurred";
    throw new Error(message);
  } else if (error.request) {
    // Request made but no response
    throw new Error("No response from server. Please try again.");
  } else {
    // Something else happened
    throw new Error(error.message || "An unexpected error occurred");
  }
};

// ==================== AUTH APIs ====================

export const register = async (data) => {
  try {
    const response = await apiClient.post("/api/auth/register/", data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const login = async (data) => {
  try {
    const response = await apiClient.post("/api/auth/login/", data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const logout = async () => {
  try {
    await apiClient.post("/api/auth/logout/");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
  } catch (error) {
    // Still clear tokens even if API call fails
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    throw error;
  }
};

// ==================== HEALTH APIs ====================

export const checkSymptoms = async (data) => {
  try {
    const response = await apiClient.post("/api/health/checks/", data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getSymptomHistory = async () => {
  try {
    const response = await apiClient.get("/api/symptoms/history/");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getHealthChecks = async () => {
  try {
    const response = await apiClient.get("/api/health/checks/");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getSymptoms = async () => {
  try {
    const response = await apiClient.get("/api/health/symptoms/");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getSymptomById = async (id) => {
  try {
    const response = await apiClient.get(`/api/health/symptoms/${id}/`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// ==================== CONTENT APIs ====================

export const getArticles = async () => {
  try {
    const response = await apiClient.get("/api/content/articles/");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getVideos = async () => {
  try {
    const response = await apiClient.get("/api/content/videos/");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// ==================== FIRST AID APIs ====================

export const getFirstAid = async () => {
  try {
    const response = await apiClient.get("/api/firstaid/");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const searchFirstAid = async (query) => {
  try {
    const response = await apiClient.get(`/api/firstaid/?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// ==================== CHAT APIs ====================

export const chatInteract = async (message) => {
  try {
    const response = await apiClient.post("/api/chat/interact/", { message });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// ==================== SKIN DIAGNOSIS APIs ====================

export const uploadSkinDiagnosis = async (formData) => {
  try {
    const response = await apiClient.post("/api/skin-diagnosis/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// ==================== USER PROFILE APIs ====================

export const getUserProfile = async () => {
  try {
    const response = await apiClient.get("/api/auth/me/");
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateUserProfile = async (data) => {
  try {
    const response = await apiClient.patch("/api/auth/me/", data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// ==================== UTILITY FUNCTIONS ====================

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Get current user token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Export API client for custom requests
export default apiClient;