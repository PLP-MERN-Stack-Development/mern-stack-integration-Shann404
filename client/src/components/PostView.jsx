import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PostContext } from "../context/PostContext";
import { postService } from "../services/api";

export default function PostView() {
  const { id } = useParams();
  const { posts, loading: contextLoading, error: contextError, fetchPosts } = useContext(PostContext);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(contextLoading);
  const [error, setError] = useState(contextError);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState({ name: "", text: "" });
  const [submitting, setSubmitting] = useState(false);
const currentUser = { _id: "672b6f00baf5e90c2ad3c111" }; // temporary test ID


  useEffect(() => {
    const existingPost = posts.find((p) => p._id === id);

    const fetchData = async () => {
      try {
        setLoading(true);
        const postData = existingPost || (await postService.getPost(id));
        setPost(postData);
        const commentsData = await postService.getComments(id);
        setComments(commentsData);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err.response?.data?.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, posts, fetchPosts]);

  const handleCommentSubmit = async (e) => {
  e.preventDefault();
  if (!comment.text.trim()) return;

  setSubmitting(true);
  try {
    const newComment = await postService.addComment(id, {
      userId: currentUser._id,
      content: comment.text,
    });

    console.log(" New comment added:", newComment);
    setComments((prev) => [...prev, { content: comment.text }]);
    setComment({ name: "", text: "" });
  } catch (err) {
    console.error(" Error adding comment:", err);
  } finally {
    setSubmitting(false);
  }
};

  if (loading) return <div className="flex justify-center items-center min-h-screen bg-gray-50"><p className="text-gray-600 animate-pulse">Loading post...</p></div>;
  if (error) return <div className="flex justify-center items-center min-h-screen bg-red-50"><p className="text-red-600 font-medium">Error loading post: {error}</p></div>;
  if (!post) return <div className="flex justify-center items-center min-h-screen bg-gray-50"><p className="text-gray-500">Post not found.</p></div>;

  return (
    <div className="min-h-screen py-10 px-4 md:px-8 lg:px-16">
      <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-2xl shadow-md">
        <h1 className="text-4xl font-bold mb-2 text-white">{post.title}</h1>
        <p className="text-gray-300 mb-6">
          By {post.author?.name || "Unknown"} •{" "}
          {new Date(post.createdAt).toLocaleDateString()}
        </p>

        {post.featuredImage && (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-auto mb-6 rounded-xl object-cover"
          />
        )}

        <div
          className="prose prose-lg text-gray-200 mb-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Comment Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-white">Comments</h2>

          {/* Comment List */}
          <div className="space-y-4 mb-6">
            {comments.length > 0 ? (
              comments.map((c, index) => (
                <div key={index} className="p-4 bg-gray-700 rounded-lg">
                  <p className="text-gray-200">{c.content}</p>
                  <span className="text-sm text-gray-400">
                    — {c.userId?.name || "Anonymous"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No comments yet. Be the first to comment!</p>
            )}
          </div>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Your name"
              value={comment.name}
              onChange={(e) => setComment({ ...comment, name: e.target.value })}
              className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              placeholder="Write a comment..."
              value={comment.text}
              onChange={(e) => setComment({ ...comment, text: e.target.value })}
              className="w-full p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            ></textarea>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
