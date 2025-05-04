import React from 'react';
import illustrationImage from '../assets/about.jpg'; // Hero illustration
import teamIllustration from '../assets/about.jpg'; // Team illustration for "Who We Are"
import phoneGraphic from '../assets/about.jpg'; // Phone graphic for "Who We Are"
import { Link } from "react-router-dom";
import { FaHeartbeat, FaCamera, FaExclamationTriangle, FaBook, FaStethoscope, FaMapPin, FaComments } from "react-icons/fa";

const Home = () => {
  // Content data for easy updates
  const content = {
    about: {
      hero: {
        title: 'Your Health, Our Priority:',
        subtitle: 'Expert Medical Care at Your Fingertips',
        description: 'MediHelp+ provides personalized healthcare solutions, connecting you with professionals for teleconsultations and first aid guidance.',
        ctaButtonText: 'Book a Consultation',
        ctaLink: '/find-doctor',
      },
      whoWeAre: {
        title: 'Connect With Top Doctors',
        description: ' We are a dedicated group of healthcare professionals committed to providing exceptional medical services.    Our team includes specialists across various fields, ensuring comprehensive care tailored to your needs.  With expertise in cardiology, dermatology, neurology, and general practice, we are here to support your health journey every step of the way.',
        buttonText: 'Find Doctors Now',
        buttonLink: '/find-doctor',
      },
    },
    howWeHelp: {
      title: 'Complete Healthcare Solutions',
      sections: [
        {
          buttonText: 'Check Symptoms',
          buttonLink: '/symptom-checker',
          title: 'Symptom Checker',
          icon: <FaHeartbeat className="h-8 w-8 text-blue-600" />,
          description: 'Check your symptoms and get preliminary insights about possible conditions.',
        },
        {
          title: 'Skin Diagnosis',
          icon: <FaCamera className="h-8 w-8 text-blue-600" />,
          description: 'Upload a photo of your skin condition for AI-powered analysis and recommendations.',
          buttonText: 'Check Skin Condition',
          buttonLink: '/skin-diagnosis',
        },
        {
          title: 'First Aid Guides',
          icon: <FaExclamationTriangle className="h-8 w-8 text-blue-600" />,
          description: 'Access comprehensive first aid guides and home remedies for common issues.',
          buttonText: 'View Guides',
          buttonLink: '/first-aid',
        },
        {
          title: 'Health Education',
          icon: <FaBook className="h-8 w-8 text-blue-600" />,
          description: 'Learn about various health conditions through articles and educational videos.',
          buttonText: 'Learn More',
          buttonLink: '/education',
        },
        {
          title: 'Find Doctors',
          icon: <FaStethoscope className="h-8 w-8 text-blue-600" />,
          description: 'Connect with qualified healthcare professionals for teleconsultations.',
          buttonText: 'Find Doctors',
          buttonLink: '/doctors',
        },
        {
          title: 'Nearby Clinics',
          icon: <FaMapPin className="h-8 w-8 text-blue-600" />,
          description: 'Locate healthcare facilities near you when you need in-person care.',
          buttonText: 'Find Clinics',
          buttonLink: '/clinics',
        },
        {
          title: 'Health Chat',
          icon: <FaComments className="h-8 w-8 text-blue-600" />,
          description: 'Ask health-related questions anytime with SmartChat.',
          buttonText: 'Start Chatting',
          buttonLink: '/chat',
        },
      ],
    },
  };

  return (
    <div className="flex flex-col bg-gray-50 font-sans">
      {/* About Section */}
      <section className="flex-1 flex items-center justify-center text-left px-4 py-16 md:py-24 bg-gradient-to-r from-gray-50 to-purple-50">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          {/* Text Content */}
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              {content.about.hero.title}
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-blue-600 mb-4">
              {content.about.hero.subtitle}
            </h2>
            <p className="text-lg text-gray-600 max-w-lg mb-6">
              {content.about.hero.description}
            </p>
            <a
              href={content.about.hero.ctaLink}
              className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-700 transition"
              aria-label="Request a free consultation"
            >
              {content.about.hero.ctaButtonText}
            </a>
          </div>
          {/* Hero Illustration */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src={illustrationImage}
              alt="Illustration of professionals collaborating on product development"
              className="w-64 h-64 md:w-96 md:h-96 object-contain"
            />
          </div>
        </div>
      </section>

      {/* How We Help Section */}
      <section className="px-4 py-16 md:py-24 bg-gradient-to-r from-gray-50 to-purple-50">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">
            {content.howWeHelp.title}
          </h2>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
            {content.howWeHelp.sections.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start gap-4"
              >
                <div className="flex items-center gap-4">
                  {section.icon}
                  <h3 className="text-xl font-semibold text-gray-800">
                    {section.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-base">
                  {section.description}
                </p>
                <Link to={section.buttonLink}>
                  <button className="mt-4 w-full border cursor-pointer border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition">
                    {section.buttonText}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="flex items-center justify-center text-left px-4 py-16 md:py-24 bg-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          {/* Team Illustration */}
          <div className="md:w-1/2 flex justify-center mb-8 md:mb-0">
            <img
              src={teamIllustration}
              alt="Illustration of the Pomegranate Studio team"
              className="w-64 h-64 md:w-96 md:h-96 object-contain"
            />
          </div>
          {/* Text Content */}
          <div className="md:w-1/2 relative">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {content.about.whoWeAre.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-lg mb-6">
              {content.about.whoWeAre.description}
            </p>
            <a
              href={content.about.whoWeAre.buttonLink}
              className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-700 transition"
              aria-label="Learn more about us"
            >
              {content.about.whoWeAre.buttonText}
            </a>
            {/* Phone Graphic */}
            <img
              src={phoneGraphic}
              alt="Telegram Mini App on phone"
              className="absolute hidden md:block top-0 right-0 w-32 h-48 object-contain transform translate-x-12 -translate-y-12"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;