import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { postService } from "../services/api";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // <-- user input text
  const limit = 6;

  const fetchPosts = useCallback(async (page = 1, search = "") => {
    try {
      setLoading(true);
      const data = await postService.getAllPosts(page, limit, search);
      setPosts(data.posts || data || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || page);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err.response?.data?.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch initial posts
  useEffect(() => {
    fetchPosts(currentPage, searchTerm);
  }, [currentPage]);

  // Debounce search effect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPosts(1, searchTerm);
    }, 500); // waits 0.5s after typing stops

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleNext = () => {
    if (currentPage < totalPages) fetchPosts(currentPage + 1, searchTerm);
  };

  const handlePrev = () => {
    if (currentPage > 1) fetchPosts(currentPage - 1, searchTerm);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-gray-400 animate-pulse">Loading posts...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <p className="text-red-600 font-medium">Error loading posts: {error}</p>
      </div>
    );

  return (
    <div className="min-h-screen py-10 px-6 md:px-12 lg:px-20 pt-20 bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-center text-white">
          Latest Posts
        </h2>

        {/* 🔍 Search Bar */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full md:w-1/2 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts available yet.</p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between"
                >
                  {post.featuredImage && (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="rounded-xl mb-4 h-48 w-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-2 hover:text-indigo-400 transition">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {post.excerpt || post.content?.slice(0, 100) + "..."}
                    </p>
                  </div>

                  <Link
                    to={`/posts/${post._id}`}
                    className="mt-auto inline-block text-indigo-400 font-medium hover:underline transition"
                  >
                    Read More →
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-10 gap-4">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg disabled:opacity-50 transition"
              >
                Previous
              </button>
              <span className="text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg disabled:opacity-50 transition"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
