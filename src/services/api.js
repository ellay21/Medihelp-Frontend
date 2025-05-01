import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const register = (data) => axios.post(`${API_URL}/api/auth/register/`, data);
export const login = (data) => axios.post(`${API_URL}/api/auth/login/`, data);