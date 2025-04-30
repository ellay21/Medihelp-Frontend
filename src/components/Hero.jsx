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
      }}
    >
      <NavBar />
    
      <div className="container mx-auto text-center px-4 absolute top-1/3 ">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Empower Your Health with AI
        </h1>
        <p className="text-lg md:text-xl mb-8">
          MediHelp+ provides personalized health insights, emergency guidance,
          and daily wellness coaching—all in one platform.
        </p>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition">
          Get Started for Free
        </button>
      </div>
    </div>
  );
};

export default Hero;