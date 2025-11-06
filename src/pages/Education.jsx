import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { getArticles, getVideos } from "../services/api";
import { AlertCircle, Loader2, BookOpen, Video, Search, Calendar, Tag, ExternalLink, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Education = () => {
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState("articles");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Function to extract YouTube video ID from URL
  const getYouTubeId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [articlesResponse, videosResponse] = await Promise.all([getArticles(), getVideos()]);
        
        // Handle paginated response - the API returns data directly, not nested in response.data
        const articlesData = articlesResponse.results || articlesResponse || [];
        const videosData = videosResponse.results || videosResponse || [];
        
        const publishedArticles = articlesData.filter(
          (article) => article.is_published
        );
        const publishedVideos = videosData.filter(
          (video) => video.is_published
        );
        
        setArticles(publishedArticles);
        setVideos(publishedVideos);
      } catch (err) {
        console.error("Error fetching educational content:", err);
        setError(err.message || "Failed to fetch educational content");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredContent = () => {
    const query = searchQuery.toLowerCase();
    if (activeTab === "articles") {
      return articles.filter((article) => {
        const tagsString = Array.isArray(article.tags)
          ? article.tags.join(", ").toLowerCase()
          : (article.tags || "").toLowerCase();
        return (
          article.title.toLowerCase().includes(query) ||
          article.summary.toLowerCase().includes(query) ||
          tagsString.includes(query)
        );
      });
    } else {
      return videos.filter((video) =>
        video.title.toLowerCase().includes(query) ||
        (video.related_symptoms || []).some((s) => s.name.toLowerCase().includes(query))
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900">
      <NavBar />
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-4 shadow-lg"
            >
              <BookOpen className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Health Education
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore our collection of articles and videos to learn more about various health topics, conditions, and wellness practices
            </p>
          </div>
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search for health topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg transition-all"
              />
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white dark:bg-gray-800 rounded-xl p-1.5 shadow-lg border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("articles")}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === "articles"
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Articles
              </button>
              <button
                onClick={() => setActiveTab("videos")}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === "videos"
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Video className="w-4 h-4" />
                Videos
              </button>
            </div>
          </div>
          {/* Error State */}
          {error && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          )}
          {/* Loading State */}
          {isLoading ? (
            <div className="text-center py-16">
              <Loader2 className="animate-spin h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto" />
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Loading {activeTab}...
              </p>
            </div>
          ) : filteredContent().length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                {activeTab === "articles" ? (
                  <BookOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                ) : (
                  <Video className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No {activeTab} found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery ? "Try adjusting your search terms" : `No ${activeTab} available at the moment`}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              <AnimatePresence>
                {filteredContent().map((item, index) =>
                  activeTab === "articles" ? (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden group"
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                            <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {item.title}
                            </h2>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(item.published_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{item.summary}</p>
                        {item.tags && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {(Array.isArray(item.tags) ? item.tags : [item.tags]).slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium"
                              >
                                <Tag className="w-3 h-3" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <a
                          href="https://en.wikipedia.org/wiki/Health"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
                        >
                          Read Article
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden group"
                    >
                      <div className="relative w-full h-0 pb-[56.25%] bg-gray-900">
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={`https://www.youtube.com/embed/${getYouTubeId(item.video_url)}`}
                          title={item.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div className="p-6">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                            <Play className="w-5 h-5 text-red-600 dark:text-red-400" />
                          </div>
                          <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {item.title}
                            </h2>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(item.published_date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        {item.related_symptoms?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {item.related_symptoms.slice(0, 3).map((symptom, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                              >
                                {symptom.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Education;
