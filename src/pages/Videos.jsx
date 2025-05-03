import { useState, useEffect } from "react";
import { getVideos } from "../services/api"; // Updated import path to match your project structure
import NavBar from "../components/NavBar";

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");

  // Function to extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await getVideos();
        // Extract results and filter for published videos
        const publishedVideos = (response.data.results || []).filter(
          (video) => video.is_published
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
      <div className="min-h-screen bg-gray-100 py-8 mt-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
            Educational Videos
          </h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {videos.length === 0 ? (
            <p className="text-gray-500 text-center">No videos available.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => {
                const youtubeId = getYouTubeId(video.video_url);
                return (
                  <div
                    key={video.id}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
                  >
                    <h2 className="text-xl font-semibold mb-2 text-blue-600">{video.title}</h2>
                    {/* Embed YouTube Video */}
                    {youtubeId ? (
                      <div className="relative w-full h-0 pb-[56.25%] mb-4">
                        <iframe
                          className="absolute top-0 left-0 w-full h-full rounded-lg"
                          src={`https://www.youtube.com/embed/${youtubeId}`}
                          title={video.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <p className="text-red-500 mb-4">Invalid YouTube URL</p>
                    )}
                    <p className="text-gray-500 text-sm mb-2">
                      <strong>Duration:</strong> {video.duration_minutes} minutes
                    </p>
                    {video.related_symptoms?.length > 0 && (
                      <p className="text-gray-500 text-sm mb-2">
                        <strong>Related Symptoms:</strong>{" "}
                        {video.related_symptoms.map((symptom) => symptom.name).join(", ")}
                      </p>
                    )}
                    <p className="text-gray-500 text-sm">
                      <strong>Published:</strong>{" "}
                      {new Date(video.published_date).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Videos;