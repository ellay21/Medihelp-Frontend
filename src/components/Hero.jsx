import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import NavBar from "./NavBar";

import heroBg1 from "../assets/hero-bg.png";
import about1 from "../assets/about1.png";
import about2 from "../assets/about2.jpg";

const Hero = () => {
  const images = [heroBg1, about1, about2]; // array of images
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // rotate image every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000); // 4000ms = 4 second

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div
      className="bg-blue-600 text-white py-20 min-h-screen relative transition-all duration-1000"
      style={{
        backgroundImage: `url(${images[currentImageIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <NavBar />

      <div className="container mx-auto text-center px-4 absolute top-1/3">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Empower Your Health with AI
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          MediHelp+ provides personalized health insights, emergency guidance,
          and daily wellness coaching—all in one platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.4 }}
        >
          <Link to="/signup">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition">
              Get Started for Free
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
