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
} from "lucide-react";
import { getHealthChecks, getSymptomById } from "../services/api";

// Mock useAuth (replace with your actual implementation)
const useAuth = () => {
  const [user, setUser] = useState({ first_name: "Doctor" });
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  return { user, isAuthenticated, isLoading };
};

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [patientCases, setPatientCases] = useState([]);
  const [isLoadingCases, setIsLoadingCases] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchPatientCases = async () => {
      try {
        setIsLoadingCases(true);
        const response = await getHealthChecks();
        const data = response.results || [];

        // Fetch symptom names for each patient case
        const casesWithSymptomNames = await Promise.all(
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

        setPatientCases(casesWithSymptomNames);
      } catch (error) {
        console.error("Error fetching patient cases:", error);
        // Fallback to dummy data if API call fails
        setPatientCases([
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
        setIsLoadingCases(false);
      }
    };
    fetchPatientCases();
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container py-10 mt-15 ml-3">
      <NavBar />
      <h1 className="text-3xl font-bold mb-6">Welcome, Dr. {user.first_name}!</h1>

      <div className="mb-6">
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 rounded-md transition ${
              activeTab === "dashboard"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("patient-records")}
            className={`px-4 py-2 rounded-md transition ${
              activeTab === "patient-records"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Patient Records
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`px-4 py-2 rounded-md transition ${
              activeTab === "schedule"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Schedule
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {activeTab === "dashboard" && (
          <>
            <div className="grid gap-6 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <Activity className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="text-xl font-semibold">View Patient List</h3>
                      <p className="text-gray-600">See all your patients</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/patients")}
                    className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    View Patients
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <AlertTriangle className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="text-xl font-semibold">Pending Diagnoses</h3>
                      <p className="text-gray-600">Review unresolved cases</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/pending-diagnoses")}
                    className="w-full py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                  >
                    View Cases
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <Stethoscope className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="text-xl font-semibold">Patient Consultations</h3>
                      <p className="text-gray-600">Manage consultations</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/consultations")}
                    className="w-full py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                  >
                    Start Consultation
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Recent Patient Cases</h3>
              <p className="text-gray-600 mb-4">Your recent patient cases and actions needed</p>
              {isLoadingCases ? (
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading your patient cases...</p>
                </div>
              ) : patientCases.length > 0 ? (
                <div className="space-y-4">
                  {patientCases.slice(0, 3).map((caseItem) => (
                    <motion.div
                      key={caseItem.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-md"
                    >
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Activity className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Case #{caseItem.id}</h4>
                            <p className="text-sm text-gray-600">
                              Patient Symptoms: {caseItem.symptomNames.join(", ")}
                            </p>
                            <p className="text-sm text-gray-600">
                              Diagnosis: {caseItem.conditions.length > 0 ? caseItem.conditions.map(c => c.name).join(", ") : "Pending"}
                            </p>
                            <p className="text-sm text-gray-600">
                              Urgency: {caseItem.diagnosis.urgency}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500">
                            <Clock className="h-3 w-3 mr-1 inline" />
                            {new Date(caseItem.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/patient-case/${caseItem.id}`)}
                          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
                        >
                          Review Case
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  {patientCases.length > 3 && (
                    <div className="text-center mt-4">
                      <button
                        onClick={() => setActiveTab("patient-records")}
                        className="text-blue-600 hover:underline"
                      >
                        View all patient cases
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No recent patient cases to review.</p>
                  <button
                    onClick={() => navigate("/patients")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Check Patients
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "patient-records" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Your Patient Records</h3>
            <p className="text-gray-600 mb-4">View all patient cases and diagnoses</p>
            {isLoadingCases ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading your patient records...</p>
              </div>
            ) : patientCases.length > 0 ? (
              <div className="space-y-4">
                {patientCases.map((caseItem) => (
                  <motion.div
                    key={caseItem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Activity className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Case #{caseItem.id}</h4>
                            <p className="text-sm text-gray-600">
                              Patient Symptoms: {caseItem.symptomNames.join(", ")}
                            </p>
                            <p className="text-sm text-gray-600">
                              Diagnosis: {caseItem.conditions.length > 0 ? caseItem.conditions.map(c => c.name).join(", ") : "Pending"}
                            </p>
                            <p className="text-sm text-gray-600">
                              Severity: {caseItem.conditions.length > 0 ? caseItem.conditions.map(c => c.severity_display).join(", ") : "N/A"}
                            </p>
                            <p className="text-sm text-gray-600">
                              Urgency: {caseItem.diagnosis.urgency}
                            </p>
                            <p className="text-sm text-gray-600">
                              Recommendations: {caseItem.diagnosis.recommendations.slice(0, 3).join(", ")}{caseItem.diagnosis.recommendations.length > 3 ? "..." : ""}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500">
                            <Clock className="h-3 w-3 mr-1 inline" />
                            {new Date(caseItem.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/patient-case/${caseItem.id}`)}
                          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
                        >
                          Review Case
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No patient records available.</p>
                <button
                  onClick={() => navigate("/patients")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Check Patients
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Your Schedule</h3>
            <p className="text-gray-600 mb-4">Manage your teleconsultations and appointments</p>
            {isLoadingCases ? (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading your schedule...</p>
              </div>
            ) : patientCases.length > 0 ? (
              <div className="space-y-4">
                {patientCases.map((caseItem) => (
                  <motion.div
                    key={caseItem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">Appointment #{caseItem.id}</h4>
                            <p className="text-sm text-gray-600">
                              Patient Issue: {caseItem.symptomNames.join(", ")}
                            </p>
                            <p className="text-sm text-gray-600">
                              Diagnosis: {caseItem.conditions.length > 0 ? caseItem.conditions.map(c => c.name).join(", ") : "To be reviewed"}
                            </p>
                            <p className="text-sm text-gray-600">
                              Urgency: {caseItem.diagnosis.urgency}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500">
                            <Clock className="h-3 w-3 mr-1 inline" />
                            {new Date(caseItem.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/appointment/${caseItem.id}`)}
                          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
                        >
                          Join Consultation
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">You don't have any upcoming appointments.</p>
                <button
                  onClick={() => navigate("/schedule")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Check Schedule
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;