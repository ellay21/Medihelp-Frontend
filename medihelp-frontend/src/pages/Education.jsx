import React, { useState, useEffect } from "react";
import { getArticles, getVideos } from "../services/api"; // Updated import path to match your project structure
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const Education = () => {
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState("articles");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Function to extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const articlesResponse = await getArticles();
        const videosResponse = await getVideos();
        setArticles(articlesResponse.data.results);
        setVideos(videosResponse.data.results);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch content");
      }
    };
    fetchContent();
  }, []);

  const filteredContent = () => {
    const filteredArticles = articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredVideos = videos.filter(video =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { filteredArticles, filteredVideos };
  };

  const { filteredArticles, filteredVideos } = filteredContent();

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white py-8 mt-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8 text-blue-700 dark:text-blue-300">
            Educational Content
          </h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setActiveTab("articles")}
              className={`px-4 py-2 rounded ${activeTab === "articles" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
            >
              Articles
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`ml-2 px-4 py-2 rounded ${activeTab === "videos" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
            >
              Videos
            </button>
          </div>
          {activeTab === "articles" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.length === 0 ? (
                <p className="text-gray-500 text-center dark:text-gray-400">No articles available.</p>
              ) : (
                filteredArticles.map((article) => (
                  <div key={article.id} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{article.content}</p>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredVideos.length === 0 ? (
                <p className="text-gray-500 text-center dark:text-gray-400">No videos available.</p>
              ) : (
                filteredVideos.map((video) => {
                  const youtubeId = getYouTubeId(video.video_url);
                  return (
                    <div key={video.id} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-6 rounded-lg shadow-md">
                      <h2 className="text-xl font-semibold mb-2">{video.title}</h2>
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
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Education;