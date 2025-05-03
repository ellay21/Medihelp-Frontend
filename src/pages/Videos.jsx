import { useState, useEffect } from "react";
import { getVideos } from "../services/api";
import NavBar from "../components/NavBar";
const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await getVideos();
        const publishedVideos = response.data.results.filter(
          (video) => video.published_at
        );
        setVideos(publishedVideos);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch videos");
      }
    };
    fetchVideos();
  }, []);

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">
            Educational Videos
          </h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {videos.length === 0 ? (
            <p className="text-gray-500 text-center">No videos available.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <h2 className="text-xl font-semibold mb-2">{video.title}</h2>
                  <p className="text-gray-600 mb-2">{video.description}</p>
                  <p className="text-gray-500 text-sm mb-2">
                    <strong>Duration:</strong> {video.duration_minutes} minutes
                  </p>
                  {video.related_symptoms?.length > 0 && (
                    <p className="text-gray-500 text-sm mb-2">
                      <strong>Related Symptoms:</strong>{" "}
                      {video.related_symptoms.join(", ")}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm">
                    <strong>Published:</strong>{" "}
                    {new Date(video.published_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Videos;
