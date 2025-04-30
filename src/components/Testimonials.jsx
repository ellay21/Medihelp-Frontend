import React from "react";

const Testimonials = () => {
  const testimonials = [
    {
      quote:
        "MediHelp+ helped me understand my symptoms and gave me peace of mind.",
      author: "Sarah K.",
    },
    {
      quote: "The first aid feature is a lifesaver—literally!",
      author: "John D.",
    },
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
              <p className="font-semibold text-gray-800">
                - {testimonial.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
