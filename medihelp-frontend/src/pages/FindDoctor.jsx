import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

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
      try {
        const response = await api.get("/api/doctors");
        setDoctors(response.data);
      } catch (err) {
        setError("Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const specializations = [...new Set(doctors.map((doctor) => doctor.specialization))];

  const filteredDoctors = doctors.filter((doctor) => 
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (specialization === "" || doctor.specialization === specialization)
  );

  const handleBookAppointment = async (doctorId) => {
    // Logic to book an appointment with the selected doctor
    navigate(`/appointments/${doctorId}`);
  };

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
        <h1 className="text-2xl font-bold mb-4">Find a Doctor</h1>
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 mb-4"
        />
        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="border p-2 mb-4"
        >
          <option value="">All Specializations</option>
          {specializations.map((spec) => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
        <div>
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="border p-4 mb-4">
              <h2 className="text-xl font-semibold">{doctor.name}</h2>
              <p>Specialization: {doctor.specialization}</p>
              <button
                onClick={() => handleBookAppointment(doctor.id)}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FindDoctor;