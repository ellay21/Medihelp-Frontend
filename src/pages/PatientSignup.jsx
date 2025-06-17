import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, User, Phone, Calendar, Lock, AlertCircle, Loader2 } from "lucide-react";

const PatientSignup = () => {
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    date_of_birth: "",
    password: "",
    confirm_password: "",
    role: "patient",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateDateFormat = (date) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(date);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.date_of_birth) {
      setError("Date of birth is required");
      setLoading(false);
      return;
    }
    if (!validateDateFormat(formData.date_of_birth)) {
      setError("Date of birth must be in YYYY-MM-DD format");
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await register(formData); // Assuming register is imported from "../services/api"
      navigate("/login");
    } catch (err) {
      const errorMsg = err.response?.data?.error || Object.values(err.response?.data || {})[0] || "Signup failed";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-700 dark:text-blue-400">Patient Sign Up</h1>
        {error && (
          <div className="flex items-center justify-center text-red-500 dark:text-red-400 mb-3 text-sm">
            <AlertCircle className="mr-2" size={16} />
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                <User className="mr-1" size={14} /> First Name
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 transition bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
                required
              />
            </div>
            <div>
              <label className="flex items-center text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                <User className="mr-1" size={14} /> Last Name
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 transition bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
                required
              />
            </div>
          </div>
          <div>
            <label className="flex items-center text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
              <Mail className="mr-1" size={14} /> Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 transition bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                <Phone className="mr-1" size={14} /> Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 transition bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
                required
              />
            </div>
            <div>
              <label className="flex items-center text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                <Calendar className="mr-1" size={14} /> Date of Birth
              </label>
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 transition bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                <Lock className="mr-1" size={14} /> Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 transition bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
                required
              />
            </div>
            <div>
              <label className="flex items-center text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                <Lock className="mr-1" size={14} /> Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirm_password}
                onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                className="w-full px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 transition bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm"
                required
              />
            </div>
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-2 rounded-lg font-semibold text-white transition-colors text-sm ${
              loading ? "bg-blue-400 dark:bg-blue-500 cursor-not-allowed" : "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800"
            }`}
          >
            {loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Sign Up as Patient"}
          </motion.button>
        </form>
        <p className="mt-3 text-center text-gray-600 dark:text-gray-400 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline transition">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default PatientSignup;