import { useState, useEffect } from "react";

import { getArticles } from "../services/api";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
 

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await getArticles();
        // Filter only published articles from the results
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

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Health Articles</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {articles.length === 0 ? (
          <p className="text-gray-500 text-center">No articles available.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
              >
                {article.cover_image && (
                  <img
                    src={article.cover_image}
                    alt={article.title}
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                  />
                )}
                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                <p className="text-gray-600 mb-2">{article.summary}</p>
                <p className="text-gray-700 mb-4">{article.content}</p>
                <p className="text-gray-500 text-sm mb-2">
                  <strong>Tags:</strong> {article.tags || "None"}
                </p>
                {article.related_conditions?.length > 0 && (
                  <p className="text-gray-500 text-sm mb-2">
                    <strong>Related Conditions:</strong>{" "}
                    {article.related_conditions.join(", ")}
                  </p>
                )}
                <p className="text-gray-500 text-sm">
                  <strong>Published:</strong>{" "}
                  {new Date(article.published_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;