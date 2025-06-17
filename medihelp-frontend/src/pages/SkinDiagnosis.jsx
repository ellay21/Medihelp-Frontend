import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const SkinDiagnosis = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please upload an image.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await api.post("/api/skin-diagnosis", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setDiagnosis(response.data.diagnosis);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to diagnose skin condition.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Skin Diagnosis</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
          {previewUrl && <img src={previewUrl} alt="Preview" className="mb-4" />}
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
            {loading ? "Diagnosing..." : "Submit"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
        {diagnosis && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Diagnosis Result:</h2>
            <p>{diagnosis}</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SkinDiagnosis;