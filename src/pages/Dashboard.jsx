import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Stethoscope,
  Clock,
  Calendar,
  User,
  Mail,
  Phone,
  Edit2,
  Save,
  X,
  Loader2,
  Heart,
  FileText,
  TrendingUp,
  Shield,
} from "lucide-react";
import { getHealthChecks, getSymptomById, getUserProfile, updateUserProfile } from "../services/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [symptomChecks, setSymptomChecks] = useState([]);
  const [isLoadingChecks, setIsLoadingChecks] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setIsLoadingUser(true);
        const userData = await getUserProfile();
        setUser(userData);
        setProfileData(userData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        if (error.message.includes("401")) {
          navigate("/login");
        }
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  useEffect(() => {
    const fetchSymptomChecks = async () => {
      try {
        setIsLoadingChecks(true);
        const response = await getHealthChecks();
        const data = response.results || [];

        const checksWithSymptomNames = await Promise.all(
          data.map(async (check) => {
            const symptomNames = await Promise.all(
              check.symptoms.map(async (symptomId) => {
                const symptom = await getSymptomById(symptomId);
                return symptom.name;
              })
            );
            return { ...check, symptomNames };
          })
        );

        setSymptomChecks(checksWithSymptomNames);
      } catch (error) {
        console.error("Error fetching symptom checks:", error);
        setSymptomChecks([
          {
            id: 50,
            user: 19,
            symptoms: [7],
            symptomNames: ["Cough"],
            conditions: [
              {
                id: 2,
                name: "Common Cold",
                severity: 1,
                severity_display: "Mild",
                description: "Viral infection of the upper respiratory tract",
              },
            ],
            diagnosis: {
              urgency: "low",
              recommendations: [
                "Rest",
                "Hydrate (drink plenty of fluids)",
                "Over-the-counter cough medicine",
              ],
            },
            created_at: "2025-05-04T18:12:33.014794Z",
          },
          {
            id: 49,
            user: 19,
            symptoms: [7, 10, 13, 14, 15],
            symptomNames: ["Cough", "Nausea", "Diarrhea", "Vomiting", "Abdominal Pain"],
            conditions: [
              {
                id: 5,
                name: "Food Poisoning",
                severity: 3,
                severity_display: "Severe",
                description: "Gastrointestinal illness caused by contaminated food.",
              },
            ],
            diagnosis: {
              urgency: "medium",
              recommendations: [
                "Stay hydrated with clear fluids.",
                "Rest and avoid strenuous activity.",
                "Monitor symptoms for worsening.",
              ],
            },
            created_at: "2025-05-04T18:10:23.196215Z",
          },
        ]);
      } finally {
        setIsLoadingChecks(false);
      }
    };
    fetchSymptomChecks();
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    setProfileError("");
    setProfileSuccess("");

    try {
      const updatedUser = await updateUserProfile(profileData);
      setUser(updatedUser);
      setProfileData(updatedUser);
      setIsEditingProfile(false);
      setProfileSuccess("Profile updated successfully!");
      setTimeout(() => setProfileSuccess(""), 3000);
    } catch (error) {
      setProfileError(error.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setProfileData(user);
    setIsEditingProfile(false);
    setProfileError("");
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600 dark:text-slate-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900">
      <NavBar />
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {user.first_name}! 👋</h1>
          <p className="text-lg text-gray-600 dark:text-slate-300">Here's your health overview</p>
        </div>

        <div className="mb-8">
          <div className="inline-flex bg-white dark:bg-slate-800 rounded-xl p-1.5 shadow-lg border border-gray-200 dark:border-slate-600">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                  : "text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === "profile"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                  : "text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              <User className="w-4 h-4" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("health-records")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === "health-records"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                  : "text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              <FileText className="w-4 h-4" />
              Health Records
            </button>
            <button
              onClick={() => setActiveTab("appointments")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === "appointments"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                  : "text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Appointments
            </button>
          </div>
        </div>

        <div className="space-y-6">
        {activeTab === "overview" && (
          <>
            <div className="grid gap-6 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700 hover:scale-105">
                  <div className="flex items-center gap-4 mb-4">
                    <Activity className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="text-xl font-semibold dark:text-white">Symptom Checker</h3>
                      <p className="text-gray-600 dark:text-slate-300">Check your symptoms</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/symptom-checker")}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-semibold"
                  >
                    Start Check
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700 hover:scale-105">
                  <div className="flex items-center gap-4 mb-4">
                    <AlertTriangle className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="text-xl font-semibold dark:text-white">First Aid</h3>
                      <p className="text-gray-600 dark:text-slate-300">Access emergency guides</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/first-aid")}
                    className="w-full py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 font-semibold border border-gray-200 dark:border-slate-600"
                  >
                    View Guides
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700 hover:scale-105">
                  <div className="flex items-center gap-4 mb-4">
                    <Stethoscope className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="text-xl font-semibold dark:text-white">Find Doctors</h3>
                      <p className="text-gray-600 dark:text-slate-300">Book a consultation</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/doctors")}
                    className="w-full py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 font-semibold border border-gray-200 dark:border-slate-600"
                  >
                    Find Doctors
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Heart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold dark:text-white">Recent Health Checks</h3>
                  <p className="text-gray-600 dark:text-slate-300">Your recent symptom checks and results</p>
                </div>
              </div>
              {isLoadingChecks ? (
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600 dark:text-slate-300">Loading your health checks...</p>
                </div>
              ) : symptomChecks.length > 0 ? (
                <div className="space-y-4">
                  {symptomChecks.slice(0, 3).map((check) => (
                    <motion.div
                      key={check.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-start gap-4 p-5 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-700 dark:to-slate-700/50 rounded-xl border border-gray-200 dark:border-slate-600 hover:shadow-md transition-all"
                    >
                      <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-xl">
                        <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium dark:text-white">Health Check #{check.id}</h4>
                            <p className="text-sm text-gray-600 dark:text-slate-300">
                              Symptoms: {check.symptomNames.join(", ")}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-slate-300">
                              Conditions: {check.conditions.length > 0 ? check.conditions.map(c => c.name).join(", ") : "None"}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-slate-300">
                              Urgency: {check.diagnosis.urgency}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="h-3 w-3 mr-1 inline" />
                            {new Date(check.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/symptom-checker/results/${check.id}`)}
                          className="mt-3 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-semibold"
                        >
                          View Details
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  {symptomChecks.length > 3 && (
                    <div className="text-center mt-4">
                      <button
                        onClick={() => setActiveTab("health-records")}
                        className="text-blue-600 hover:underline dark:text-blue-400 font-semibold"
                      >
                        View all health checks
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-600 mb-6 dark:text-slate-300 text-lg">You haven't performed any symptom checks yet.</p>
                  <button
                    onClick={() => navigate("/symptom-checker")}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-semibold"
                  >
                    Check Symptoms Now
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "profile" && (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold dark:text-white">Your Profile</h3>
              </div>
              {!isEditingProfile && (
                <Button
                  onClick={() => setIsEditingProfile(true)}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>

            {profileSuccess && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">{profileSuccess}</AlertDescription>
              </Alert>
            )}

            {profileError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{profileError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-sm font-semibold">First Name</Label>
                  {isEditingProfile ? (
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
                      <Input
                        id="first_name"
                        name="first_name"
                        value={profileData.first_name || ""}
                        onChange={handleProfileChange}
                        className="pl-11 h-11"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900 dark:text-white p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                      {user.first_name || "Not set"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-sm font-semibold">Last Name</Label>
                  {isEditingProfile ? (
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
                      <Input
                        id="last_name"
                        name="last_name"
                        value={profileData.last_name || ""}
                        onChange={handleProfileChange}
                        className="pl-11 h-11"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900 dark:text-white p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                      {user.last_name || "Not set"}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    value={user.email || ""}
                    className="pl-11 h-11 bg-gray-100 dark:bg-slate-700 border-gray-200 dark:border-slate-600"
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              {user.phone && (
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
                  {isEditingProfile ? (
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
                      <Input
                        id="phone"
                        name="phone"
                        value={profileData.phone || ""}
                        onChange={handleProfileChange}
                        className="pl-11 h-11"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900 dark:text-white p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                      {user.phone || "Not set"}
                    </p>
                  )}
                </div>
              )}

              {user.date_of_birth && (
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth" className="text-sm font-semibold">Date of Birth</Label>
                  <p className="text-gray-900 dark:text-white p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                    {new Date(user.date_of_birth).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Account Type</Label>
                <p className="text-gray-900 dark:text-white p-3 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600 capitalize">
                  {user.role || "Patient"}
                </p>
              </div>

              {isEditingProfile && (
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    {isSavingProfile ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    disabled={isSavingProfile}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "health-records" && (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold dark:text-white">Your Health Records</h3>
                <p className="text-gray-600 dark:text-slate-300">View all your symptom checks and health data</p>
              </div>
            </div>
            {isLoadingChecks ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-slate-300">Loading your health records...</p>
              </div>
            ) : symptomChecks.length > 0 ? (
              <div className="space-y-4">
                {symptomChecks.map((check) => (
                  <motion.div
                    key={check.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-5 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-700 dark:to-slate-700/50 rounded-xl border border-gray-200 dark:border-slate-600 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-xl">
                        <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium dark:text-white">Health Check #{check.id}</h4>
                            <p className="text-sm text-gray-600 dark:text-slate-300">
                              Symptoms: {check.symptomNames.join(", ")}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-slate-300">
                              Conditions: {check.conditions.length > 0 ? check.conditions.map(c => c.name).join(", ") : "None"}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-slate-300">
                              Severity: {check.conditions.length > 0 ? check.conditions.map(c => c.severity_display).join(", ") : "N/A"}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-slate-300">
                              Urgency: {check.diagnosis.urgency}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-slate-300">
                              Recommendations: {check.diagnosis.recommendations.slice(0, 3).join(", ")}{check.diagnosis.recommendations.length > 3 ? "..." : ""}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="h-3 w-3 mr-1 inline" />
                            {new Date(check.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/symptom-checker/results/${check.id}`)}
                          className="mt-3 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-semibold"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Shield className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-4 opacity-50" />
                <p className="text-gray-600 mb-6 dark:text-slate-300 text-lg">You haven't performed any symptom checks yet.</p>
                <button
                  onClick={() => navigate("/symptom-checker")}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-semibold"
                >
                  Check Symptoms Now
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold dark:text-white">Your Appointments</h3>
                <p className="text-gray-600 dark:text-slate-300">Manage your teleconsultations and appointments</p>
              </div>
            </div>
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-4 opacity-50" />
              <p className="text-gray-600 mb-6 dark:text-slate-300 text-lg">You don't have any upcoming appointments.</p>
              <button
                onClick={() => navigate("/find-doctor")}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-semibold"
              >
                Book an Appointment
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;