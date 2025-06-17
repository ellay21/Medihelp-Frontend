import React, { useState, useEffect } from "react";
import { getSymptoms } from "../services/api"; // Assuming you have a service to fetch symptoms
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await getSymptoms();
        setSymptoms(response.data);
      } catch (err) {
        setError("Failed to fetch symptoms");
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
    try {
      const response = await diagnoseSymptoms(selectedSymptoms);
      setDiagnosis(response.data);
    } catch (err) {
      setError("Failed to get diagnosis");
    }
  };

  const filteredSymptoms = symptoms.filter((symptom) =>
    symptom.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold">Symptom Checker</h1>
        <input
          type="text"
          placeholder="Search symptoms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded"
        />
        <div className="mt-4">
          {filteredSymptoms.map((symptom) => (
            <div key={symptom.id}>
              <input
                type="checkbox"
                id={symptom.id}
                checked={selectedSymptoms.includes(symptom.id)}
                onChange={() => handleSymptomChange(symptom.id)}
              />
              <label htmlFor={symptom.id}>{symptom.name}</label>
            </div>
          ))}
        </div>
        <button onClick={handleSubmitSymptoms} className="mt-4 bg-blue-500 text-white p-2 rounded">
          Check Symptoms
        </button>
        {diagnosis && <div className="mt-4">Diagnosis: {diagnosis}</div>}
      </div>
      <Footer />
    </div>
  );
};

export default SymptomChecker;