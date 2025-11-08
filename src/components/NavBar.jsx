import { Link, useLocation } from "react-router-dom";
import { 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  Sun, 
  Moon,
  Home,
  Stethoscope,
  Heart,
  FileText,
  GraduationCap,
  Search,
  MapPin,
  LayoutDashboard,
  LogOut,
  Activity,
  Camera
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LanguageSelector from "./Languageselector";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setIsServicesOpen(false);
    setIsUserMenuOpen(false);
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleServices = () => {
    setIsServicesOpen(!isServicesOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
    setIsUserMenuOpen(false);
    if (isOpen) toggleMenu();
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const services = [
    { name: "Symptom Checker", path: "/symptom-checker", icon: Activity },
    { name: "Skin Diagnosis", path: "/skin-diagnosis", icon: Camera },
    { name: "First Aid", path: "/first-aid", icon: Heart },
    { name: "Education", path: "/education", icon: GraduationCap },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-gray-800" 
        : "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md border-b-2 border-cyan-500 dark:border-cyan-400"
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="MediHelp+ Logo" 
                className="w-12 h-12 transition-transform duration-300 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              MediHelp+
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu} 
              className="p-2 rounded-lg text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                isActive("/") 
                  ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20" 
                  : "text-gray-600 dark:text-gray-300 hover:text-cyan-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>

            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={toggleServices}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-cyan-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                <Stethoscope className="h-4 w-4" />
                <span>Services</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`}
                />
              </button>
              
              {isServicesOpen && (
                <>
                  <div 
                    className="fixed inset-0" 
                    onClick={() => setIsServicesOpen(false)}
                  ></div>
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {services.map((service) => {
                      const Icon = service.icon;
                      return (
                        <Link
                          key={service.path}
                          to={service.path}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                          onClick={() => setIsServicesOpen(false)}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{service.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <Link 
              to="/find-doctor" 
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                isActive("/find-doctor") 
                  ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20" 
                  : "text-gray-600 dark:text-gray-300 hover:text-cyan-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Find Doctor</span>
            </Link>

            <Link 
              to="/find-clinic" 
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                isActive("/find-clinic") 
                  ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20" 
                  : "text-gray-600 dark:text-gray-300 hover:text-cyan-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <MapPin className="h-4 w-4" />
              <span>Find Clinic</span>
            </Link>

            {/* Language Selector */}
            <LanguageSelector />

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User Menu */}
            {localStorage.getItem("token") ? (
              <div className="relative ml-2">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                    <User className="h-5 w-5" />
                  </div>
                </button>
                
                {isUserMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0" 
                      onClick={() => setIsUserMenuOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <button
                        onClick={() => {
                          navigate("/dashboard");
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                      >
                        <LayoutDashboard className="h-5 w-5" />
                        <span>Dashboard</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup/patient">
                  <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${
        isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link 
              to="/" 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive("/") 
                  ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20" 
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={toggleMenu}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>

            {/* Mobile Services */}
            <div>
              <button
                onClick={toggleServices}
                className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Stethoscope className="h-5 w-5" />
                  <span>Services</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isServicesOpen && (
                <div className="mt-2 ml-4 space-y-1">
                  {services.map((service) => {
                    const Icon = service.icon;
                    return (
                      <Link
                        key={service.path}
                        to={service.path}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                        onClick={toggleMenu}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{service.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link 
              to="/find-doctor" 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive("/find-doctor") 
                  ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20" 
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={toggleMenu}
            >
              <Search className="h-5 w-5" />
              <span>Find Doctor</span>
            </Link>

            <Link 
              to="/find-clinic" 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive("/find-clinic") 
                  ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20" 
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={toggleMenu}
            >
              <MapPin className="h-5 w-5" />
              <span>Find Clinic</span>
            </Link>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-2 mt-2">
              {/* Language Selector for Mobile */}
              <div className="px-4 py-3">
                <LanguageSelector />
              </div>
              
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </div>

            {localStorage.getItem("token") ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  onClick={toggleMenu}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login" onClick={toggleMenu}>
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup/patient" onClick={toggleMenu}>
                  <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
