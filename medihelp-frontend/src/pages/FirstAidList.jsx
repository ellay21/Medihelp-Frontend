import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

// Create an axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const FirstAidList = () => {
  const [firstAidGuides, setFirstAidGuides] = useState([]);
  const [homeRemedies, setHomeRemedies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("firstaid");
  const navigate = useNavigate();

  const fetchFirstAidContent = async (query = "") => {
    try {
      const response = await api.get(`/api/first-aid-guides?search=${query}`);
      setFirstAidGuides(response.data.guides);
      const remediesResponse = await api.get(`/api/home-remedies?search=${query}`);
      setHomeRemedies(remediesResponse.data.remedies);
    } catch (error) {
      console.error("Error fetching first aid content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFirstAidContent();
  }, []);

  const filteredFirstAidGuides = firstAidGuides.filter(guide =>
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHomeRemedies = homeRemedies.filter(remedy =>
    remedy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    remedy.preparation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">First Aid Guides</h1>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 mb-4"
        />
        <div>
          <h2 className="text-xl font-semibold">Guides</h2>
          {filteredFirstAidGuides.map(guide => (
            <div key={guide.id} className="border p-4 mb-2">
              <h3 className="font-bold">{guide.title}</h3>
              <p>{guide.description}</p>
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-semibold">Home Remedies</h2>
          {filteredHomeRemedies.map(remedy => (
            <div key={remedy.id} className="border p-4 mb-2">
              <h3 className="font-bold">{remedy.name}</h3>
              <p>{remedy.preparation}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FirstAidList;