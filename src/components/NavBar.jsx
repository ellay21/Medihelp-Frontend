import { Link } from "react-router-dom";
import { FaBars, FaChevronDown } from "react-icons/fa";
import { useState } from "react";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setIsServicesOpen(false); 
  };

  const toggleServices = () => {
    setIsServicesOpen(!isServicesOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="absolute top-0 left-0 w-full shadow-md z-10 bg-blue-600">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold text-white">MediHelp+</div>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <FaBars className="text-2xl" />
          </button>
        </div>
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="text-white hover:text-blue-200">
            Home
          </Link>
          <Link to="/about" className="text-white hover:text-blue-200">
            About Us
          </Link>

          <div className="relative">
            <button
              onClick={toggleServices}
              className="text-white hover:text-blue-200 flex items-center space-x-1 focus:outline-none"
            >
              <span>Services</span>
              <FaChevronDown
                className={`transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isServicesOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg">
                <Link
                  to="/articles"
                  className="block px-4 py-2 hover:bg-blue-100 text-blue-600 hover:text-blue-800"
                  onClick={() => setIsServicesOpen(false)}
                >
                  Articles
                </Link>
                <Link
                  to="/videos"
                  className="block px-4 py-2 hover:bg-blue-100 text-blue-600 hover:text-blue-800"
                  onClick={() => setIsServicesOpen(false)}
                >
                  Videos
                </Link>
                {localStorage.getItem("token") && (
                  <>
                    <Link
                      to="/symptom-checker"
                      className="block px-4 py-2 hover:bg-blue-100 text-blue-600 hover:text-blue-800"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      Symptom Checker
                    </Link>
                    <Link
                      to="/first-aid"
                      className="block px-4 py-2 hover:bg-blue-100 text-blue-600 hover:text-blue-800"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      First Aid
                    </Link>
                    <Link
                      to="/skin-diagnosis"
                      className="block px-4 py-2 hover:bg-blue-100 text-blue-600 hover:text-blue-800"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      Skin-Diagnosis
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          
          <Link to="/contact" className="text-white hover:text-blue-200">
            Contact Us
          </Link>
          {localStorage.getItem("token") ? (
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-100 transition"
            >
              Logout
            </button>
          ) : (
            <Link to="/signup">
              <button className="bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-100 transition">
                Sign Up
              </button>
            </Link>
          )}
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

            <div className="w-full text-center">
              <button
                onClick={toggleServices}
                className="text-blue-600 hover:text-blue-800 flex items-center justify-center space-x-1 w-full focus:outline-none"
              >
                <span>Services</span>
                <FaChevronDown
                  className={`transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isServicesOpen && (
                <div className="flex flex-col mt-2 space-y-2">
                  <Link
                    to="/articles"
                    className="text-blue-600 hover:text-blue-800 px-4 py-2"
                    onClick={toggleMenu}
                  >
                    Articles
                  </Link>
                  <Link
                    to="/videos"
                    className="text-blue-600 hover:text-blue-800 px-4 py-2"
                    onClick={toggleMenu}
                  >
                    Videos
                  </Link>
                  {localStorage.getItem("token") && (
                    <>
                      <Link
                        to="/symptom-checker"
                        className="text-blue-600 hover:text-blue-800 px-4 py-2"
                        onClick={toggleMenu}
                      >
                        Symptom Checker
                      </Link>
                      <Link
                        to="/first-aid"
                        className="text-blue-600 hover:text-blue-800 px-4 py-2"
                        onClick={toggleMenu}
                      >
                        First Aid
                      </Link>
                      <Link
                      to="/skin-diagnosis"
                      className="block px-4 py-2 hover:bg-blue-100 text-blue-600 hover:text-blue-800"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      Skin-Diagnosis
                    </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            
            <Link
              to="/contact"
              className="text-blue-600 hover:text-blue-800"
              onClick={toggleMenu}
            >
              Contact Us
            </Link>
            {localStorage.getItem("token") ? (
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Logout
              </button>
            ) : (
              <Link to="/signup" onClick={toggleMenu}>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
                  Sign Up
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;