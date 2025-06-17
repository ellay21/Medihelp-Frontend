import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">MediHelp</Link>
        <div className="space-x-4">
          <Link to="/about" className="text-white hover:text-blue-200">About Us</Link>
          <Link to="/clinics" className="text-white hover:text-blue-200">Clinics</Link>
          <Link to="/education" className="text-white hover:text-blue-200">Education</Link>
          <Link to="/videos" className="text-white hover:text-blue-200">Videos</Link>
          <Link to="/privacy" className="text-white hover:text-blue-200">Privacy Policy</Link>
          <Link to="/signup" className="text-white hover:text-blue-200">Sign Up</Link>
          <Link to="/login" className="text-white hover:text-blue-200">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;