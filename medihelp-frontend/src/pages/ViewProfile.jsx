import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { ArrowLeft } from "lucide-react";

// Create an axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const ViewProfile = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctor = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const apiUrl = `/api/doctors/profiles/${id}/`;

        const response = await api.get(apiUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.user) {
          setDoctor(response.data);
        } else {
          throw new Error("Invalid doctor data");
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          setError("Session expired. Please log in again.");
        } else {
          setError(err.response?.data?.message || err.message || "Failed to fetch doctor profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id, navigate]);

  if (loading) {
    return <div className="container mx-auto py-10 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-10 text-center text-red-600">Error: {error}</div>;
  }

  if (!doctor) {
    return <div className="container mx-auto py-10 text-center">Doctor not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mt-6 mx-auto py-10">
        <button
          onClick={() => navigate("/find-doctor")}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Find Doctors
        </button>
        <div className="max-w-3xl mx-auto bg-white text-gray-800 p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Doctor Profile</h1>
          <div className="space-y-4">
            <p><strong>ID:</strong> {doctor.id}</p>
            <p><strong>Name:</strong> Dr. {doctor.user.first_name} {doctor.user.last_name}</p>
            <p><strong>Email:</strong> {doctor.user.email}</p>
            <p><strong>Phone:</strong> {doctor.user.phone}</p>
            <p><strong>License Number:</strong> {doctor.license_number}</p>
            <p><strong>Specialization:</strong> {doctor.specialization}</p>
            <p><strong>Consultation Fee:</strong> ${doctor.consultation_fee}</p>
            <p><strong>Available:</strong> {doctor.available ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewProfile;