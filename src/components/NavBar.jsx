// NavBar.js
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { useState } from "react";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="absolute top-0 left-0 w-full shadow-md z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
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
          <Link to="/articles" className="text-white hover:text-blue-600">
            Articles
          </Link>
          <Link to="/videos" className="text-white hover:text-blue-600">
            Videos
          </Link>
          {localStorage.getItem("token") && (
            <>
              <Link to="/symptom-checker" className="text-white hover:text-blue-600">
                Symptom Checker
              </Link>
              <Link to="/symptom-history" className="text-white hover:text-blue-600">
                Symptom History
              </Link>
              <Link to="/admin/add-article" className="text-white hover:text-blue-600">
                Add Article
              </Link>
            </>
          )}
          <Link to="/contact" className="text-white hover:text-blue-600">
            Contact Us
          </Link>
          {localStorage.getItem("token") ? (
            <button
              onClick={handleLogout}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Logout
            </button>
          ) : (
            <Link to="/signup">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
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
            <Link
              to="/articles"
              className="text-blue-600 hover:text-blue-800"
              onClick={toggleMenu}
            >
              Articles
            </Link>
            <Link
              to="/videos"
              className="text-blue-600 hover:text-blue-800"
              onClick={toggleMenu}
            >
              Videos
            </Link>
            {localStorage.getItem("token") && (
              <>
                <Link
                  to="/symptom-checker"
                  className="text-blue-600 hover:text-blue-800"
                  onClick={toggleMenu}
                >
                  Symptom Checker
                </Link>
                <Link
                  to="/symptom-history"
                  className="text-blue-600 hover:text-blue-800"
                  onClick={toggleMenu}
                >
                  Symptom History
                </Link>
                <Link
                  to="/admin/add-article"
                  className="text-blue-600 hover:text-blue-800"
                  onClick={toggleMenu}
                >
                  Add Article
                </Link>
              </>
            )}
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