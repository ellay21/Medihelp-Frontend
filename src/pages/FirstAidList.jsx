import React, { useState, useEffect } from "react";
import { getFirstAid, searchFirstAid } from "../services/api";

import NavBar from "../components/NavBar";

const FirstAidList = () => {
  const [firstAidGuides, setFirstAidGuides] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchFirstAidGuides = async (query = "") => {
    try {
      setLoading(true);
      const response = query
        ? await searchFirstAid(query)
        : await getFirstAid();
      // Handle both direct array and paginated response
      const guides = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      setFirstAidGuides(guides);
    } catch (err) {
      setError(err.message || "Failed to fetch first aid guides");
      setFirstAidGuides([]); // Ensure firstAidGuides is an array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFirstAidGuides();
  }, []);

  const debouncedFetch = debounce((query) => {
    fetchFirstAidGuides(query);
  }, 500);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    debouncedFetch(query);
  };

  const clearSearch = () => {
    setSearchTerm("");
    fetchFirstAidGuides();
  };

  if (error)
    return <div className="text-center text-red-600">Error: {error}</div>;

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4 mt-15">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">First Aid Guides</h2>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search first aid guides (e.g., burn)"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-2  transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : firstAidGuides.length === 0 ? (
          <div className="text-center text-gray-600">
            No first aid guides found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {firstAidGuides.map((guide) => (
              <div
                key={guide.id}
                className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-blue-600">
                    {guide.title}
                  </h3>
                  <p className="text-gray-600 mt-2">{guide.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Condition: {guide.condition.name} (Severity:{" "}
                    {guide.severity_level_display})
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
        )}
      </div>
    </>
  );
};

export default FirstAidList;