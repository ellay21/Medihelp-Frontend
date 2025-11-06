import React, { useState, useEffect } from "react";
import { getSymptoms, checkSymptoms, chatInteract } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bot, CheckCircle, AlertCircle, Info, Activity, Stethoscope, Loader2, Sparkles } from "lucide-react";
import NavBar from "../components/NavBar";

const SymptomList = () => {
  const [mode, setMode] = useState("manual");
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [diagnosis, setDiagnosis] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [message, setMessage] = useState("");
  const [loadingSymptoms, setLoadingSymptoms] = useState(true); // ✅ new
  const [submitting, setSubmitting] = useState(false); // ✅ new
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [additionalSymptoms, setAdditionalSymptoms] = useState("");

  // Fetch symptoms when component mounts
  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await getSymptoms();
        setSymptoms(response.results || []);
      } catch (err) {
        setError(err.message || "Failed to fetch symptoms");
      } finally {
        setLoadingSymptoms(false);
      }
    };

    fetchSymptoms();
  }, []);

  const handleSymptomChange = (symptomId) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleSubmitSymptoms = async () => {
    if (selectedSymptoms.length === 0) {
      setError("Please select at least one symptom.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const response = await checkSymptoms({ symptoms: selectedSymptoms });
      setDiagnosis(response);
      setAiResponse(null);
    } catch (err) {
      setError(err.message || "Failed to check symptoms");
      setDiagnosis(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAiSubmit = async () => {
    if (!message.trim()) {
      setError("Please enter a message about your symptoms.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const response = await chatInteract(message);
      setAiResponse(response.response);
      setDiagnosis(null);
    } catch (err) {
      setError(err.message || "Failed to get AI response");
      setAiResponse(null);
    } finally {
      setSubmitting(false);
    }
  };

  const clearAll = () => {
    setDiagnosis(null);
    setAiResponse(null);
    setSelectedSymptoms([]);
    setMessage("");
    setAdditionalSymptoms("");
    setError(null);
  };

  const filteredSymptoms = symptoms.filter(
    (symptom) =>
      symptom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      symptom.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedSymptoms = [...filteredSymptoms].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // If not logged in
  if (!localStorage.getItem("token"))
    return (
      <div className="text-center text-red-600 flex items-center justify-center h-screen dark:text-red-400">
        <AlertCircle className="mr-2" />
        Please log in to use the Symptom Checker.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <NavBar />
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg"
            >
              <Stethoscope className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Symptom Checker
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get instant health insights by selecting your symptoms or chatting with our AI assistant
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white dark:bg-gray-800 rounded-xl p-1.5 shadow-lg border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setMode("manual")}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  mode === "manual"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Activity className="w-4 h-4" />
                Select Symptoms
              </button>
              <button
                onClick={() => setMode("ai")}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  mode === "ai"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Ask AI
              </button>
            </div>
          </div>

          {/* Manual Input */}
          {mode === "manual" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 bg-white shadow-xl rounded-2xl p-8 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Select Your Symptoms
                </h3>
              </div>
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search symptoms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                />
              </div>

              {loadingSymptoms ? (
                <div className="text-center py-12">
                  <Loader2 className="animate-spin h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto" />
                  <p className="text-gray-600 mt-4 dark:text-gray-400">Loading symptoms...</p>
                </div>
              ) : error && !diagnosis && !aiResponse ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {sortedSymptoms.map((symptom) => (
                    <motion.div
                      key={symptom.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                        selectedSymptoms.includes(symptom.id)
                          ? "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-400 shadow-lg dark:from-blue-900/30 dark:to-blue-800/30 dark:border-blue-500"
                          : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md dark:bg-gray-700 dark:border-gray-600 dark:hover:border-blue-600"
                      }`}
                    >
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedSymptoms.includes(symptom.id)}
                          onChange={() => handleSymptomChange(symptom.id)}
                          className="mr-3 h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-600 dark:border-gray-500"
                        />
                        <span className="text-gray-900 dark:text-white font-medium flex-1">{symptom.name}</span>
                        {selectedSymptoms.includes(symptom.id) && (
                          <CheckCircle className="ml-2 w-5 h-5 text-green-500 dark:text-green-400" />
                        )}
                      </label>
                    </motion.div>
                  ))}
                </div>
              )}

              {selectedSymptoms.length > 0 && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    Selected Symptoms ({selectedSymptoms.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map((id) => {
                      const symptom = symptoms.find((s) => s.id === id);
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                        >
                          {symptom?.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Additional Symptoms Text Area */}
              <div className="mb-6">
                <label htmlFor="additionalSymptoms" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Additional Symptoms or Details (Optional)
                </label>
                <textarea
                  id="additionalSymptoms"
                  value={additionalSymptoms}
                  onChange={(e) => setAdditionalSymptoms(e.target.value)}
                  placeholder="Describe any other symptoms or additional details that might help with diagnosis..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none transition-all"
                />
                {additionalSymptoms && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {additionalSymptoms.length} characters
                  </p>
                )}
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={handleSubmitSymptoms}
                  disabled={submitting || loadingSymptoms || selectedSymptoms.length === 0}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg ${
                    submitting || selectedSymptoms.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Stethoscope className="w-5 h-5" />
                      Check Symptoms
                    </>
                  )}
                </button>
                {selectedSymptoms.length > 0 && (
                  <button
                    onClick={() => setSelectedSymptoms([])}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-semibold dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* AI Input */}
          {mode === "ai" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 bg-white shadow-xl rounded-2xl p-8 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Ask AI About Your Symptoms
                </h3>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your symptoms in detail... e.g., 'I am feeling nausea and a mild headache for the past 2 days'"
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none transition-all"
                  />
                </div>
                <button
                  onClick={handleAiSubmit}
                  disabled={submitting || !message.trim()}
                  className={`w-full flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg ${
                    submitting || !message.trim()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      AI is analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Get AI Analysis
                    </>
                  )}
                </button>
              </div>
              {error && !diagnosis && !aiResponse && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Diagnosis & AI Result */}
          <AnimatePresence>
            {(diagnosis || aiResponse) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="mt-8 p-8 bg-white shadow-2xl rounded-2xl border-2 border-blue-200 dark:bg-gray-800 dark:border-blue-800"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Analysis Results
                  </h3>
                </div>
            <div className="space-y-6">
              {/* Symptom-Based Diagnosis */}
              {diagnosis && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Symptom-Based Diagnosis
                  </h4>
                  <div className="space-y-4 mt-2">
                    <div>
                      <h5 className="text-md font-medium text-gray-700 dark:text-gray-300">
                        Conditions
                      </h5>
                      {diagnosis.conditions.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-600 mt-2 space-y-2 dark:text-gray-400">
                          {diagnosis.conditions.map((condition) => (
                            <li key={condition.id}>
                              <span className="font-medium text-gray-800 dark:text-white">
                                {condition.name}
                              </span>{" "}
                              (Severity: {condition.severity_display})
                              <p className="text-sm dark:text-gray-300">
                                {condition.description}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Created:{" "}
                                {new Date(
                                  condition.created_at
                                ).toLocaleDateString()}
                              </p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">
                          No conditions identified.
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-600 mt-2 dark:text-gray-400">
                        <span className="font-medium dark:text-white">
                          Urgency:{" "}
                        </span>
                        <span
                          className={`capitalize ${
                            diagnosis.diagnosis.urgency === "low"
                              ? "text-green-600 dark:text-green-400"
                              : diagnosis.diagnosis.urgency === "medium"
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {diagnosis.diagnosis.urgency}
                        </span>
                      </p>
                      <h5 className="text-md font-medium text-gray-700 mt-4 dark:text-gray-300">
                        Recommendations:
                      </h5>
                      <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 dark:text-gray-400">
                        {diagnosis.diagnosis.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-sm text-gray-500 mt-4 dark:text-gray-400">
                      Check Created:{" "}
                      {new Date(diagnosis.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {/* AI Analysis */}
              {aiResponse && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                    AI Analysis
                  </h4>
                  <div className="space-y-4 mt-2">
                    <div>
                      <h5 className="text-md font-medium text-gray-700 dark:text-gray-300">
                        Possible Conditions
                      </h5>
                      <ul className="list-disc list-inside text-gray-600 mt-2 space-y-2 dark:text-gray-400">
                        {aiResponse.conditions.map((condition, idx) => (
                          <li
                            key={idx}
                            className="font-medium text-gray-800 dark:text-white"
                          >
                            {condition}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-gray-600 mt-2 dark:text-gray-400">
                        <span className="font-medium dark:text-white">
                          Urgency:{" "}
                        </span>
                        <span
                          className={`capitalize ${
                            aiResponse.urgency === "low"
                              ? "text-green-600 dark:text-green-400"
                              : aiResponse.urgency === "medium"
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {aiResponse.urgency}
                        </span>
                      </p>
                      <h5 className="text-md font-medium text-gray-700 mt-4 dark:text-gray-300">
                        Recommendations:
                      </h5>
                      <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 dark:text-gray-400">
                        {aiResponse.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
                <div className="flex justify-center mt-8 gap-4">
                  <button
                    onClick={clearAll}
                    className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Start New Check
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SymptomList;
