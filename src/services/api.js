// api.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const register = (data) =>
  axios.post(`${API_URL}/api/auth/register/`, data);
export const login = (data) => axios.post(`${API_URL}/api/auth/login/`, data);
export const checkSymptoms = (data) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API_URL}/api/symptoms/check/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const getSymptomHistory = () => {
  const token = localStorage.getItem("token");
  return axios.get(`${API_URL}/api/symptoms/history/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const getArticles = () => {
  return axios.get(`${API_URL}/api/content/articles/`);
};
export const getVideos = () => {
    return axios.get(`${API_URL}/api/content/videos/`);
  };