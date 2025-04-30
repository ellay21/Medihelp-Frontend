import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { useState } from "react";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="absolute top-5 left-0 w-full shadow-md z-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">MediHelp+</div>

        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <FaBars className="text-2xl" />
          </button>
        </div>

        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="text-white hover:text-blue-600">
            Home
          </Link>
          <Link to="/about" className="text-white hover:text-blue-600">
            About Us
          </Link>
          <Link to="/services" className="text-white hover:text-blue-600">
            Services
          </Link>
          <Link to="/doctors" className="text-white hover:text-blue-600">
            Doctors
          </Link>
          <Link to="/contact" className="text-white hover:text-blue-600">
            Contact Us
          </Link>
          <Link to="/signup">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
              Sign Up
            </button>
          </Link>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="flex flex-col items-center space-y-4 py-4">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-blue-600 hover:text-blue-800"
              onClick={toggleMenu}
            >
              About Us
            </Link>
            <Link
              to="/services"
              className="text-blue-600 hover:text-blue-800"
              onClick={toggleMenu}
            >
              Services
            </Link>
            <Link
              to="/doctors"
              className="text-blue-600 hover:text-blue-800"
              onClick={toggleMenu}
            >
              Doctors
            </Link>
            <Link
              to="/contact"
              className="text-blue-600 hover:text-blue-800"
              onClick={toggleMenu}
            >
              Contact Us
            </Link>
            <Link to="/signup" onClick={toggleMenu}>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
