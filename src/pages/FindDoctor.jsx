import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { Search, User, Calendar } from "lucide-react";

const FindDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [specialization, setSpecialization] = useState("");
  const navigate = useNavigate();

  // Dummy data for doctors
  const getSampleDoctors = () => {
    return [
      {
        id: 1,
        user: { first_name: "Mohammed", last_name: "Ali" },
        specialization: "Neurologist",
        consultation_fee: 150,
        license_number: "MED123456",
        bio: "Experienced neurologist with over 10 years of practice.",
        available: true,
      },
      {
        id: 2,
        user: { first_name: "Chere", last_name: "Lema" },
        specialization: "Gastroenterologist",
        consultation_fee: 150,
        license_number: "MED789012",
        bio: "Specializing in gastrointestinal disorders.",
        available: true,
      },
      {
        id: 3,
        user: { first_name: "Abebe", last_name: "Kebede" },
        specialization: "Pediatrician",
        consultation_fee: 100,
        license_number: "MED345678",
        bio: "Dedicated to providing quality care for children.",
        available: false,
      },
      {
        id: 4,
        user: { first_name: "Selam", last_name: "Tesfaye" },
        specialization: "Cardiologist",
        consultation_fee: 180,
        license_number: "MED901234",
        bio: "Specializing in heart conditions.",
        available: true,
      },
    ];
  };

  useEffect(() => {
    setDoctors(getSampleDoctors());
  }, []);

  // Get unique specializations
  const specializations = [...new Set(doctors.map((doctor) => doctor.specialization))];

  const filteredDoctors = doctors.filter((doctor) => {
    const nameMatch = `${doctor.user.first_name} ${doctor.user.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const specializationMatch = specialization ? doctor.specialization === specialization : true;
    return nameMatch && specializationMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 my-15">
      <NavBar />
      <div className="container mx-auto py-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Find a Doctor</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect with qualified healthcare professionals for teleconsultations and get the care you need from the comfort of your home.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by doctor name..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative w-full md:w-48">
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none bg-white"
              >
                <option value="">Specialization</option>
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {filteredDoctors.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Dr. {doctor.user.first_name} {doctor.user.last_name}
                      </h3>
                      <p className="text-gray-600">{doctor.specialization}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        doctor.available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {doctor.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Consultation Fee</p>
                      <p className="text-sm text-gray-600">${doctor.consultation_fee}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/doctors/${doctor.id}/book`)}
                      className={`flex-1 py-2 rounded-lg font-semibold text-white transition-colors ${
                        doctor.available
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!doctor.available}
                    >
                      <Calendar className="inline mr-2 h-4 w-4" />
                      Book Appointment
                    </button>
                    <button
                      onClick={() => navigate(`/doctors/${doctor.id}`)}
                      className="flex-1 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No doctors found</h3>
              <p className="text-gray-600 mb-6">
                No doctors match your search criteria. Try adjusting your filters.
              </p>
              {(searchQuery || specialization) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSpecialization("");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          <div className="mt-12 p-6 border rounded-lg bg-gray-100 text-center">
            <h3 className="text-xl font-bold mb-2">Are you a healthcare professional?</h3>
            <p className="text-gray-600 mb-4 max-w-lg mx-auto">
              Join our platform to connect with patients and offer teleconsultations.
            </p>
            <button
              onClick={() => navigate("/register-doctor")}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Register as a Doctor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindDoctor;