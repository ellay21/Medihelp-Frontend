
const Features = () => {
  const features = [
    {
      title: "Adaptive Symptom Checker",
      icon: "🔍",
      description:
        "Input symptoms to receive likely causes and tailored next steps.",
    },
    {
      title: "Voice-Guided First Aid",
      icon: "🎙️",
      description:
        "Step-by-step audio instructions for emergencies, even offline.",
    },
    {
      title: "Personalized Health Education",
      icon: "📚",
      description: "Daily tips and lessons tailored to your health profile.",
    },
    {
      title: "Conversational Health AI",
      icon: "💬",
      description: "Ask health-related questions anytime with SmartChat.",
    },
    {
      title: "Localized Health Alerts",
      icon: "📍",
      description: "Real-time updates on local health risks and outbreaks.",
    },
    {
      title: "Multi-Language Support",
      icon: "🌍",
      description:
        "Access MediHelp+ in Amharic, Afaan Oromo, Tigrinya, and more.",
    },
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose MediHelp+?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <span className="text-4xl mb-4 block">{feature.icon}</span>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
