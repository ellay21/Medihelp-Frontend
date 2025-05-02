// Hero.js
import heroBg from "../assets/hero-bg.png";
import NavBar from "./NavBar";

const Hero = () => {
  return (
    <div
      className="bg-blue-600 text-white py-20 min-h-screen relative"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <NavBar />
      <div className="container mx-auto text-center px-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Empower Your Health with AI
        </h1>
        <p className="text-lg md:text-xl mb-8">
          MediHelp+ provides personalized health insights, emergency guidance, and
          daily wellness coaching—all in one platform.
        </p>
        <button
          className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition"
          aria-label="Get started with MediHelp+ for free"
        >
          Get Started for Free
        </button>
      </div>
      {/* Popup Button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg z-50"
        aria-label="Ask your medical questions now"
      >
        Ask Your Medical Questions Now
      </button>
    </div>
  );
};

export default Hero;