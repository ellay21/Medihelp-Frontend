import React, { useState, useEffect, useRef } from "react";
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
  const resultsRef = useRef(null);

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
      console.log("Full Diagnosis response:", response);
      console.log("Response type:", typeof response);
      console.log("Response keys:", Object.keys(response || {}));
      setDiagnosis(response);
      setAiResponse(null);
      
      // Scroll to results after a short delay
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
          console.log("Scrolled to results");
        } else {
          console.log("Results ref not found");
        }
      }, 500);
    } catch (err) {
      console.error("Error checking symptoms:", err);
      const errorMessage = err.message || "Failed to check symptoms";
      
      // Check if it's a throttling error
      if (errorMessage.includes("throttled") || errorMessage.includes("Expected available in")) {
        const match = errorMessage.match(/(\d+)\s*seconds/);
        const seconds = match ? match[1] : "a few";
        setError(`⏱️ Too many requests. Please wait ${seconds} seconds before trying again.`);
      } else {
        setError(errorMessage);
      }
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
      console.log("AI response:", response);
      setAiResponse(response.response);
      setDiagnosis(null);
      
      // Scroll to results after a short delay
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } catch (err) {
      console.error("Error getting AI response:", err);
      const errorMessage = err.message || "Failed to get AI response";
      
      // Check if it's a throttling error
      if (errorMessage.includes("throttled") || errorMessage.includes("Expected available in")) {
        const match = errorMessage.match(/(\d+)\s*seconds/);
        const seconds = match ? match[1] : "a few";
        setError(`⏱️ Too many requests. Please wait ${seconds} seconds before trying again.`);
      } else {
        setError(errorMessage);
      }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900">
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
            <div className="inline-flex bg-white dark:bg-slate-800 rounded-xl p-1.5 shadow-lg border border-gray-200 dark:border-slate-600">
              <button
                onClick={() => setMode("manual")}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  mode === "manual"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                    : "text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
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
                    : "text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
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
              className="mb-8 bg-white shadow-xl rounded-2xl p-8 dark:bg-slate-800 border border-gray-200 dark:border-slate-600"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
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
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-all"
                />
              </div>

              {loadingSymptoms ? (
                <div className="text-center py-12">
                  <Loader2 className="animate-spin h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto" />
                  <p className="text-gray-600 mt-4 dark:text-slate-300">Loading symptoms...</p>
                </div>
              ) : error && !diagnosis && !aiResponse ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                  {sortedSymptoms.map((symptom) => (
                    <div
                      key={symptom.id}
                      onClick={() => handleSymptomChange(symptom.id)}
                      className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden hover:scale-[1.03] hover:-translate-y-1 active:scale-[0.97] ${
                        selectedSymptoms.includes(symptom.id)
                          ? "bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 border-blue-500 shadow-xl ring-2 ring-blue-400 ring-opacity-50 dark:from-blue-900/40 dark:via-blue-800/40 dark:to-indigo-900/40 dark:border-blue-400"
                          : "bg-white border-gray-200 hover:border-blue-400 hover:shadow-lg dark:bg-slate-700 dark:border-slate-600 dark:hover:border-blue-500 dark:hover:bg-slate-700/80"
                      }`}
                    >
                      {/* Animated background gradient on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        selectedSymptoms.includes(symptom.id) ? "opacity-100" : ""
                      }`} />
                      
                      <label className="relative flex items-start cursor-pointer space-x-3">
                        <div className="flex items-center h-6 mt-0.5">
                          <input
                            type="checkbox"
                            checked={selectedSymptoms.includes(symptom.id)}
                            onChange={() => handleSymptomChange(symptom.id)}
                            className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300 rounded transition-all cursor-pointer dark:bg-slate-600 dark:border-slate-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-base font-semibold transition-colors ${
                              selectedSymptoms.includes(symptom.id)
                                ? "text-blue-700 dark:text-blue-300"
                                : "text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"
                            }`}>
                              {symptom.name}
                            </span>
                            {selectedSymptoms.includes(symptom.id) && (
                              <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 animate-in zoom-in duration-200" />
                            )}
                          </div>
                          {symptom.description && (
                            <p className={`text-xs leading-relaxed transition-colors ${
                              selectedSymptoms.includes(symptom.id)
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-500 dark:text-slate-400 group-hover:text-gray-700 dark:group-hover:text-slate-300"
                            }`}>
                              {symptom.description.length > 80 
                                ? `${symptom.description.substring(0, 80)}...` 
                                : symptom.description
                              }
                            </p>
                          )}
                        </div>
                      </label>
                      
                      {/* Selected indicator bar */}
                      {selectedSymptoms.includes(symptom.id) && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-in slide-in-from-left duration-300" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selectedSymptoms.length > 0 && (
                <div className="mb-6 p-5 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-blue-900/30 rounded-2xl border-2 border-blue-200 dark:border-blue-700 shadow-md animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Selected Symptoms ({selectedSymptoms.length})
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSymptoms([]);
                      }}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map((id) => {
                      const symptom = symptoms.find((s) => s.id === id);
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold shadow-sm border border-blue-200 dark:border-blue-700 transition-transform hover:scale-105"
                        >
                          <Activity className="w-3.5 h-3.5" />
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white resize-none transition-all"
                />
                {additionalSymptoms && (
                  <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">
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
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-semibold dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
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
              className="mb-8 bg-white shadow-xl rounded-2xl p-8 dark:bg-slate-800 border border-gray-200 dark:border-slate-600"
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white resize-none transition-all"
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

          {/* Debug Info - Remove after testing */}
          {diagnosis && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <p className="text-sm font-mono text-yellow-900 dark:text-yellow-300">
                Debug: Diagnosis data exists - {JSON.stringify(Object.keys(diagnosis))}
              </p>
            </div>
          )}

          {/* Diagnosis & AI Result */}
          <AnimatePresence>
            {(diagnosis || aiResponse) && (
              <motion.div
                ref={resultsRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="mt-8 p-8 bg-white shadow-2xl rounded-2xl border-2 border-blue-200 dark:bg-slate-800 dark:border-blue-700"
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
                          {diagnosis.conditions && diagnosis.conditions.length > 0 ? (
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
                                diagnosis.diagnosis?.urgency === "low"
                                  ? "text-green-600 dark:text-green-400"
                                  : diagnosis.diagnosis?.urgency === "medium"
                                  ? "text-yellow-600 dark:text-yellow-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {diagnosis.diagnosis?.urgency || "N/A"}
                            </span>
                          </p>
                          <h5 className="text-md font-medium text-gray-700 mt-4 dark:text-gray-300">
                            Recommendations:
                          </h5>
                          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 dark:text-gray-400">
                            {diagnosis.diagnosis?.recommendations?.map((rec, idx) => (
                              <li key={idx}>{rec}</li>
                            )) || <li className="text-gray-500">No recommendations available</li>}
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
                        {aiResponse.conditions?.map((condition, idx) => (
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
                          {aiResponse.urgency || "N/A"}
                        </span>
                      </p>
                      <h5 className="text-md font-medium text-gray-700 mt-4 dark:text-gray-300">
                        Recommendations:
                      </h5>
                      <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1 dark:text-gray-400">
                        {aiResponse.recommendations?.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        )) || <li className="text-gray-500">No recommendations available</li>}
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
