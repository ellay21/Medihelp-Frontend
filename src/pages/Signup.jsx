import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Stethoscope, UserCircle } from "lucide-react";

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-2xl w-full max-w-2xl"
      >
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-700 dark:text-blue-400">Join MediHelp+</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">Please select your role to sign up</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/signup/doctor">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-50 dark:bg-blue-900/50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-center space-x-4 cursor-pointer"
            >
              <Stethoscope className="text-blue-600 dark:text-blue-400" size={32} />
              <div>
                <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-400">Sign Up as Doctor</h2>
                <p className="text-gray-600 dark:text-gray-400">Join as a medical professional</p>
              </div>
            </motion.div>
          </Link>
          <Link to="/signup/patient">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-50 dark:bg-blue-900/50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-center space-x-4 cursor-pointer"
            >
              <UserCircle className="text-blue-600 dark:text-blue-400" size={32} />
              <div>
                <h2 className="text-xl font-semibold text-blue-700 dark:text-blue-400">Sign Up as Patient</h2>
                <p className="text-gray-600 dark:text-gray-400">Join as a patient</p>
              </div>
            </motion.div>
          </Link>
        </div>
        <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline transition">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;