import React from 'react';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const DoctorDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="container mx-auto py-10 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
        <p className="text-lg text-gray-700">
          Welcome to your dashboard! Here you can manage your appointments, view patient information, and access resources to assist you in your practice.
        </p>
        {/* Additional dashboard features can be added here */}
      </div>
      <Footer />
    </div>
  );
};

export default DoctorDashboard;