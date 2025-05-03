import React from 'react';
import illustrationImage from '../assets/about.jpg'; // Hero illustration
import teamIllustration from '../assets/about.jpg'; // Team illustration for "Who We Are"
import phoneGraphic from '../assets/about.jpg'; // Phone graphic for "Who We Are"
// import HowItWorks from '../components/HowItWorks'; // Import HowItWorks component

const Home = () => {
  // Content data for easy updates
  const content = {
    about: {
      hero: {
        title: 'Turn Your Vision into Reality:',
        subtitle: 'Expert Product Development for Startups & Businesses',
        description: 'We specialize in helping startups and businesses navigate the critical 0-to-1 phase of product development—from concept to initial market traction.',
        ctaButtonText: 'Get Free Consultation',
        ctaLink: '/consultation',
      },
      whoWeAre: {
        title: 'Who We Are?',
        description: 'Pomegranate Studio is a digital product development studio and venture builder based in Helsinki, Finland. We specialize in helping startups and businesses launch innovative digital products, from initial concept to market traction. We’re experts in Telegram Mini Apps, the TON Blockchain, and the Play2Win gaming model.',
        buttonText: 'About Us',
        buttonLink: '/about-us',
      },
    },
    howWeHelp: {
      title: 'How We Help You Succeed',
      sections: [
        {
          buttonText: 'Learn More',
          buttonLink: '/digital-product-development',
          title: "Adaptive Symptom Checker",
          icon: "🔍",
          description: "Input symptoms to receive likely causes and tailored next steps.",
        },
        {
          title: "Voice-Guided First Aid",
          icon: "🎙️",
          description: "Step-by-step audio instructions for emergencies, even offline.",
          buttonText: 'Learn More',
          buttonLink: '/co-founding-partnerships',
        },
        {
          title: "Personalized Health Education",
          icon: "📚",
          description: "Daily tips and lessons tailored to your health profile.",
          buttonText: 'Learn More',
          buttonLink: '/go-to-market-strategy',
        },
        {
          title: "Conversational Health AI",
          icon: "💬",
          description: "Ask health-related questions anytime with SmartChat.",
          buttonText: 'Learn More',
          buttonLink: '/play2win-competition',
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
            <h2 className="text-2xl md:text-3xl font-semibold text-purple-600 mb-4">
              {content.about.hero.subtitle}
            </h2>
            <p className="text-lg text-gray-600 max-w-lg mb-6">
              {content.about.hero.description}
            </p>
            <a
              href={content.about.hero.ctaLink}
              className="inline-block bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-700 transition"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {content.howWeHelp.sections.map((section, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <span className="text-2xl text-yellow-500 mr-4" role="img" aria-label={section.title}>
                    {section.icon}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {section.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">{section.description}</p>
                <a
                  href={section.buttonLink}
                  className="inline-block bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition"
                  aria-label={`Learn more about ${section.title}`}
                >
                  {section.buttonText}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      {/* <HowItWorks /> Adding HowItWorks component here */}

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
              className="inline-block bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-700 transition"
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