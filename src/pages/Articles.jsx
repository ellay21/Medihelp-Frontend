import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { getArticles } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Tag, AlertCircle } from "lucide-react";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const [expandedArticles, setExpandedArticles] = useState({}); // Track expanded state for each article

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await getArticles();
        const publishedArticles = response.data.results.filter(
          (article) => article.is_published
        );
        setArticles(publishedArticles);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch articles");
      }
    };
    fetchArticles();
  }, []);

  const toggleContent = (articleId) => {
    setExpandedArticles((prev) => ({
      ...prev,
      [articleId]: !prev[articleId],
    }));
  };

  const truncateContent = (content, length = 100) => {
    if (content.length <= length) return content;
    return content.slice(0, length) + "...";
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-100 py-8 mt-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">Health Articles</h1>
          {error && (
            <div className="flex items-center justify-center text-red-500 mb-4">
              <AlertCircle className="mr-2" />
              {error}
            </div>
          )}
          {articles.length === 0 ? (
            <p className="text-gray-500 text-center">No articles available.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {articles.map((article) => {
                  const isExpanded = expandedArticles[article.id] || false;
                  return (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      {article.cover_image && (
                        <img
                          src={article.cover_image}
                          alt={article.title}
                          loading="lazy"
                          className="w-full h-48 object-cover rounded-t-lg mb-4"
                        />
                      )}
                      <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                      <p className="text-gray-600 mb-2">{article.summary}</p>
                      <motion.div
                        initial={{ height: "auto" }}
                        animate={{ height: "auto" }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-gray-700 mb-4">
                          {isExpanded ? article.content : truncateContent(article.content, 100)}
                        </p>
                        {article.content.length > 100 && (
                          <button
                            onClick={() => toggleContent(article.id)}
                            className="text-blue-600 hover:underline mb-4 focus:outline-none"
                          >
                            {isExpanded ? "Read Less" : "Read More"}
                          </button>
                        )}
                      </motion.div>
                      <div className="flex items-center mb-2">
                        <Tag className="mr-2 text-gray-500" />
                        <p className="text-gray-500 text-sm">
                          <strong>Tags:</strong> {article.tags || "None"}
                        </p>
                      </div>
                      {article.related_conditions?.length > 0 && (
                        <div className="flex items-center mb-2">
                          <AlertCircle className="mr-2 text-gray-500" />
                          <p className="text-gray-500 text-sm">
                            <strong>Related Conditions:</strong>{" "}
                            {article.related_conditions.join(", ")}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="mr-2 text-gray-500" />
                        <p className="text-gray-500 text-sm">
                          <strong>Published:</strong>{" "}
                          {new Date(article.published_at).toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Articles;