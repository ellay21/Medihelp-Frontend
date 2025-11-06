import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import { Search, User, Calendar, Stethoscope, MapPin, Star, Phone, Mail, Award, Loader2, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Create an axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const FindDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const apiUrl = "/api/doctors/profiles";

        const response = await api.get(apiUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.results && Array.isArray(response.data.results)) {
          setDoctors(response.data.results);
        } else {
          throw new Error("Unexpected response format: No 'results' array found in response data");
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          setError("Session expired or invalid token. Please log in again.");
        } else {
          setError(err.response?.data?.message || err.message || "Failed to fetch doctors");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [navigate]);

  const specializations = [...new Set(doctors.map((doctor) => doctor.specialization))];

  const filteredDoctors = doctors.filter((doctor) => {
    const nameMatch = `${doctor.user.first_name} ${doctor.user.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const specializationMatch = specialization ? doctor.specialization === specialization : true;
    return nameMatch && specializationMatch;
  });

  const handleBookAppointment = async (doctorId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const apiUrl = `/api/doctors/profiles/${doctorId}/`;
      const response = await api.get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.user && response.data.user.phone) {
        window.location.href = `tel:${response.data.user.phone}`;
      } else {
        setError("Phone number not available for this doctor.");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        setError("Session expired or invalid token. Please log in again.");
      } else {
        setError(err.response?.data?.message || err.message || "Failed to fetch doctor profile");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <NavBar />
        <div className="container mx-auto px-4 py-8 mt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-400">Finding the best doctors for you...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <NavBar />
        <div className="container mx-auto px-4 py-8 mt-20">
          <Card className="max-w-md mx-auto border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-red-600 dark:text-red-400 mb-4">Error: {error}</div>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <NavBar />
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Stethoscope className="h-10 w-10 text-blue-600" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Find a Doctor
              </h1>
            </div>
            <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto text-lg">
              Connect with qualified healthcare professionals for teleconsultations and get the care you need from the comfort of your home.
            </p>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">Verified Doctors</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold">Top Rated</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-green-600" />
                <span className="font-semibold">24/7 Available</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search by doctor name..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative w-full md:w-48">
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none bg-white dark:bg-gray-900 text-gray-800 dark:text-white"
              >
                <option value="">Specialization</option>
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {filteredDoctors.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDoctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                          <Stethoscope className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-lg">
                              Dr. {doctor.user.first_name} {doctor.user.last_name}
                            </CardTitle>
                            <div className={`w-2 h-2 rounded-full ${doctor.available ? "bg-green-500" : "bg-gray-400"}`}></div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{doctor.specialization}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Consultation</span>
                      </div>
                      <span className="text-lg font-bold text-blue-600">${doctor.consultation_fee}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleBookAppointment(doctor.id)}
                        disabled={!doctor.available}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Appointment
                      </Button>
                      <Button
                        onClick={() => navigate(`/find-doctor/${doctor.id}`)}
                        variant="outline"
                        className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">No doctors found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                No doctors match your search criteria. Try adjusting your filters.
              </p>
              {(searchQuery || specialization) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSpecialization("");
                  }}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindDoctor;
