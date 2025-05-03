import heroBg from "../assets/hero-bg.png";
import NavBar from "./NavBar";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div
      className="bg-blue-600 text-white py-20 min-h-screen relative"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <NavBar />

      <div className="container mx-auto text-center px-4 absolute top-1/3">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: 50 }} // Start off-screen (hidden and below)
          animate={{ opacity: 1, y: 0 }} // Fade in and slide up
          transition={{ duration: 0.8, ease: "easeOut" }} // Smooth transition
        >
          Empower Your Health with AI
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl mb-8"
          initial={{ opacity: 0 }} // Start hidden
          animate={{ opacity: 1 }} // Fade in
          transition={{ duration: 0.8, delay: 0.2 }} // Delay for staggered effect
        >
          MediHelp+ provides personalized health insights, emergency guidance,
          and daily wellness coaching—all in one platform.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} // Start hidden and slightly scaled down
          animate={{ opacity: 1, scale: 1 }} // Fade in and scale up
          transition={{ duration: 0.8, delay: 0.4 }} // Delay for staggered effect
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