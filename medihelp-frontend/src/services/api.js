import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Authentication
export const login = async (credentials) => {
  return await api.post("/api/auth/login/", credentials);
};

export const signup = async (userData) => {
  return await api.post("/api/auth/signup/", userData);
};

// Fetch doctors
export const fetchDoctors = async () => {
  return await api.get("/api/doctors/");
};

// Fetch patient appointments
export const fetchPatientAppointments = async (token) => {
  return await api.get("/api/patient/appointments/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Fetch doctor appointments
export const fetchDoctorAppointments = async (token) => {
  return await api.get("/api/doctor/appointments/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Fetch clinics
export const fetchClinics = async () => {
  return await api.get("/api/clinics/");
};

// Fetch videos
export const fetchVideos = async () => {
  return await api.get("/api/videos/");
};

// Fetch articles
export const fetchArticles = async () => {
  return await api.get("/api/articles/");
};

// Fetch symptoms
export const fetchSymptoms = async () => {
  return await api.get("/api/symptoms/");
};

// Fetch doctor profile
export const fetchDoctorProfile = async (id, token) => {
  return await api.get(`/api/doctors/profiles/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Export the api instance for use in other files
export default api;