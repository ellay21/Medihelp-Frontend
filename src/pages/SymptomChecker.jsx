import React, { useState, useEffect } from "react";
import { getSymptoms, checkSymptoms, chatInteract } from "../services/api";

const SymptomList = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [diagnosis, setDiagnosis] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await getSymptoms();
        setSymptoms(response.data.results);
      } catch (err) {
        setError(err.message || "Failed to fetch symptoms");
      } finally {
        setLoading(false);
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
      setLoading(true);
      setError(null);
      const response = await checkSymptoms({ symptoms: selectedSymptoms });
      setDiagnosis(response.data);
    } catch (err) {
      setError(err.message || "Failed to check symptoms");
      setDiagnosis(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAiSubmit = async () => {
    if (!message.trim()) {
      setError("Please enter a message about your symptoms.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await chatInteract(message);
      setAiResponse(response.data.response);
    } catch (err) {
      setError(err.message || "Failed to get AI response");
      setAiResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setDiagnosis(null);
    setAiResponse(null);
    setSelectedSymptoms([]);
    setMessage("");
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

  if (!localStorage.getItem("token"))
    return <div className="text-center text-red-600">Please log in to use the Symptom Checker.</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Symptom Checker</h2>

      {/* Symptom Selection */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Your Symptoms</h3>
        <input
          type="text"
          placeholder="Search symptoms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        />
        {loading && !diagnosis && !aiResponse ? (
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <p className="text-gray-600 mt-2">Loading...</p>
          </div>
        ) : error && !diagnosis && !aiResponse ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {sortedSymptoms.map((symptom) => (
              <div key={symptom.id} className="relative group">
                <label
                  className={`flex items-center p-4 rounded-lg border ${
                    selectedSymptoms.includes(symptom.id)
                      ? "bg-blue-100 border-blue-300"
                      : "bg-gray-50 border-gray-200"
                  } hover:bg-gray-100 transition-colors`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSymptoms.includes(symptom.id)}
                    onChange={() => handleSymptomChange(symptom.id)}
                    className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-lg font-medium text-gray-800">{symptom.name}</span>
                </label>
                <div className="absolute hidden group-hover:block bg-white p-2 rounded shadow-md mt-1 z-10">
                  <p className="text-sm text-gray-600">{symptom.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mb-4">
          <p className="text-gray-700">
            Selected Symptoms:{" "}
            {selectedSymptoms
              .map((id) => symptoms.find((s) => s.id === id)?.name)
              .join(", ")}
          </p>
        </div>
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={handleSubmitSymptoms}
            disabled={loading}
            className={`px-6 py-2 rounded-full font-semibold text-white ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } transition-colors`}
          >
            {loading ? "Submitting..." : "Submit Symptoms"}
          </button>
          <button
            onClick={() => setSelectedSymptoms([])}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
          >
            Clear Selection
          </button>
        </div>
      </div>

      {/* AI Interaction */}
      <div className="mb-8">
        
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Or Ask AI About Your Pain</h3>
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g., I am feeling nausea and a mild headache"
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={handleAiSubmit}
            disabled={loading}
            className={`px-6 py-2 rounded-full font-semibold text-white ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } transition-colors`}
          >
            {loading ? "Asking..." : "Ask AI"}
          </button>
        </div>
        {error && !diagnosis && !aiResponse && <div className="text-center text-red-600">{error}</div>}
      </div>

      {/* Diagnosis Result */}
      {(diagnosis || aiResponse) && (
        <div className="mt-8 p-6 bg-white shadow-lg rounded-lg border border-blue-100">
          <h3 className="text-2xl font-bold text-blue-700 mb-4">Diagnosis Result</h3>
          <div className="space-y-6">
            {diagnosis && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Symptom-Based Diagnosis</h4>
                <div className="space-y-4 mt-2">
                  <div>
                    <h5 className="text-md font-medium text-gray-700">Conditions</h5>
                    {diagnosis.conditions.length > 0 ? (
                      <ul className="list-disc list-inside text-gray-600 mt-2 space-y-2">
                        {diagnosis.conditions.map((condition) => (
                          <li key={condition.id}>
                            <span className="font-medium text-gray-800">{condition.name}</span> (Severity: {condition.severity_display})
                            <p className="text-sm">{condition.description}</p>
                            <p className="text-xs text-gray-500">
                              Created: {new Date(condition.created_at).toLocaleDateString()}
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">No conditions identified.</p>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-600 mt-2">
                      <span className="font-medium">Urgency: </span>
                      <span className={`capitalize ${diagnosis.diagnosis.urgency === "low" ? "text-green-600" : diagnosis.diagnosis.urgency === "medium" ? "text-yellow-600" : "text-red-600"}`}>
                        {diagnosis.diagnosis.urgency}
                      </span>
                    </p>
                    <h5 className="text-md font-medium text-gray-700 mt-4">Recommendations:</h5>
                    <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                      {diagnosis.diagnosis.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Check Created: {new Date(diagnosis.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {aiResponse && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mt-6">AI Analysis</h4>
                <div className="space-y-4 mt-2">
                  <div>
                    <h5 className="text-md font-medium text-gray-700">Possible Conditions</h5>
                    <ul className="list-disc list-inside text-gray-600 mt-2 space-y-2">
                      {aiResponse.conditions.map((condition, index) => (
                        <li key={index} className="font-medium text-gray-800">{condition}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-gray-600 mt-2">
                      <span className="font-medium">Urgency: </span>
                      <span className={`capitalize ${aiResponse.urgency === "low" ? "text-green-600" : aiResponse.urgency === "medium" ? "text-yellow-600" : "text-red-600"}`}>
                        {aiResponse.urgency}
                      </span>
                    </p>
                    <h5 className="text-md font-medium text-gray-700 mt-4">Recommendations:</h5>
                    <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                      {aiResponse.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={clearAll}
              className="px-6 py-2 rounded-full font-semibold text-white bg-gray-500 hover:bg-gray-600 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomList;