import React, { useState, useEffect } from "react";
import { getFirstAid } from "../services/api";

const FirstAidList = () => {
  const [firstAidGuides, setFirstAidGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFirstAidGuides = async () => {
      try {
        const response = await getFirstAid();
        console.log(response.data)
        setFirstAidGuides(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch first aid guides");
      } finally {
        setLoading(false);
      }
    };

    fetchFirstAidGuides();
  }, []);

  if (loading) return <div className="text-center text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">First Aid Guides</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {firstAidGuides.map((guide) => (
          <div
            key={guide.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-4">
              <h3 className="text-xl font-semibold text-blue-600">{guide.title}</h3>
              <p className="text-gray-600 mt-2">{guide.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                Condition: {guide.condition.name} (Severity: {guide.severity_level_display})
              </p>
              <div className="mt-4">
                <h4 className="font-medium text-gray-700">Steps:</h4>
                <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                  {guide.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Created: {new Date(guide.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FirstAidList;