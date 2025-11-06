import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { 
  ArrowLeft, 
  Stethoscope, 
  Mail, 
  Phone, 
  Award, 
  Calendar, 
  Clock,
  MapPin,
  Star,
  CheckCircle,
  Loader2,
  CreditCard,
  Shield
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

        if (typeof response.data === "object" && response.data !== null && response.data.user) {
          setDoctor(response.data);
        } else {
          throw new Error("Unexpected response format: Invalid doctor data");
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          setError("Session expired or invalid token. Please log in again.");
        } else {
          setError(err.response?.data?.message || err.message || "Failed to fetch doctor profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id, navigate]);

  const handleBookAppointment = () => {
    if (doctor?.user?.phone) {
      window.location.href = `tel:${doctor.user.phone}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <NavBar />
        <div className="container mx-auto px-4 py-8 mt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-400">Loading doctor profile...</p>
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
                <Button onClick={() => navigate("/find-doctor")}>Back to Find Doctors</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <NavBar />
        <div className="container mx-auto px-4 py-8 mt-20">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">Doctor not found</p>
              <Button onClick={() => navigate("/find-doctor")}>Back to Find Doctors</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const initials = `${doctor.user.first_name[0]}${doctor.user.last_name[0]}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <NavBar />
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Button
            onClick={() => navigate("/find-doctor")}
            variant="ghost"
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Find Doctors
          </Button>

          {/* Doctor Profile Header */}
          <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm mb-6">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar */}
                <Avatar className="h-32 w-32 border-4 border-blue-500">
                  <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                {/* Doctor Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Dr. {doctor.user.first_name} {doctor.user.last_name}
                      </h1>
                      <p className="text-xl text-gray-600 dark:text-gray-400 mb-3">
                        {doctor.specialization}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant={doctor.available ? "default" : "secondary"}
                          className={doctor.available ? "bg-green-500" : "bg-gray-400"}
                        >
                          {doctor.available ? "Available Now" : "Currently Unavailable"}
                        </Badge>
                        <Badge variant="outline" className="border-blue-500 text-blue-600">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                        <Star className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
                        <p className="font-semibold text-gray-900 dark:text-white">4.8/5</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Award className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Experience</p>
                        <p className="font-semibold text-gray-900 dark:text-white">10+ Years</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Patients</p>
                        <p className="font-semibold text-gray-900 dark:text-white">500+</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Clock className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Response</p>
                        <p className="font-semibold text-gray-900 dark:text-white">~15 min</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Left Column - Contact & Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-blue-600" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                      <p className="font-medium text-gray-900 dark:text-white">{doctor.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                      <p className="font-medium text-gray-900 dark:text-white">{doctor.user.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Details */}
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-blue-600" />
                    Professional Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">License Number</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{doctor.license_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Specialization</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{doctor.specialization}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-gray-900 dark:text-white">Consultation Fee</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">${doctor.consultation_fee}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Per session (30-45 minutes)</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Actions */}
            <div className="space-y-6">
              {/* Book Appointment Card */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Book Appointment</h3>
                  <p className="text-sm mb-6 text-blue-50">
                    Get instant consultation with Dr. {doctor.user.last_name}
                  </p>
                  <Button
                    onClick={handleBookAppointment}
                    disabled={!doctor.available}
                    className="w-full bg-white text-blue-600 hover:bg-blue-50"
                    size="lg"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Appointment
                  </Button>
                  {!doctor.available && (
                    <p className="text-xs text-blue-100 mt-2 text-center">
                      Currently unavailable
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Availability Card */}
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Availability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Monday - Friday</span>
                      <span className="font-medium text-gray-900 dark:text-white">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Saturday</span>
                      <span className="font-medium text-gray-900 dark:text-white">10:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Sunday</span>
                      <span className="font-medium text-gray-900 dark:text-white">Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewProfile;
