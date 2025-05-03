import React, { useState } from "react";
import NavBar from "../components/NavBar";
import { uploadSkinDiagnosis } from "../services/api";

const SkinDiagnosis = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setDiagnosis(null); // Reset diagnosis when a new file is selected
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setLoading(true);
      setError(null);
      const response = await uploadSkinDiagnosis(formData);
      setDiagnosis(response.data);
    } catch (err) {
      setError(err.message || "Failed to upload image or get diagnosis");
    } finally {
      setLoading(false);
    }
  };

  if (!localStorage.getItem("token")) return <div className="text-center text-red-600">Please log in to use Skin Diagnosis.</div>;

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Skin Diagnosis</h2>

        {/* Upload Form */}
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 border border-blue-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Upload Skin Image</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {error && !diagnosis && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-6 py-2 rounded-full font-semibold text-white ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} transition-colors`}
            >
              {loading ? "Analyzing..." : "Submit"}
            </button>
          </form>
        </div>

        {/* Diagnosis Result */}
        {diagnosis && (
          <div className="mt-8 p-6 bg-white shadow-lg rounded-lg border border-blue-100">
            <h3 className="text-2xl font-bold text-blue-700 mb-4">Diagnosis Result</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Image</h4>
                <img
                  src={diagnosis.image}
                  alt="Skin Diagnosis"
                  className="mt-2 w-full max-w-md rounded-lg shadow-md"
                />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Conditions</h4>
                <ul className="list-disc list-inside text-gray-600 mt-2 space-y-2">
                  {diagnosis.diagnosis.conditions.map((condition, index) => (
                    <li key={index} className="font-medium text-gray-800">{condition}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-gray-600 mt-2">
                  <span className="font-medium">Confidence: </span>
                  {Math.round(diagnosis.diagnosis.confidence * 100)}%
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-medium">Urgency: </span>
                  <span className={`capitalize ${diagnosis.diagnosis.urgency === "low" ? "text-green-600" : diagnosis.diagnosis.urgency === "medium" ? "text-yellow-600" : "text-red-600"}`}>
                    {diagnosis.diagnosis.urgency}
                  </span>
                </p>
              </div>
              <div>
                <h4 className="text-md font-medium text-gray-700 mt-4">Recommendations:</h4>
                <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                  {diagnosis.diagnosis.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Created: {new Date(diagnosis.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Updated: {new Date(diagnosis.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SkinDiagnosis;