import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { PostContext } from "../context/PostContext"; // adjust the path if needed




export default function PostForm({ editPost }) {
  const { createPost, posts, setPosts } = useContext(PostContext); // ✅ use context
  const [form, setForm] = useState({
    title: "",
    content: "",
    featuredImage: "",
    category: "",
    author: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Prefill when editing
  useEffect(() => {
    if (editPost) setForm(editPost);
  }, [editPost]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required.";
    else if (form.title.length < 3) newErrors.title = "Title must be at least 3 characters.";

    if (!form.content.trim()) newErrors.content = "Content is required.";
    else if (form.content.length < 10) newErrors.content = "Content must be at least 10 characters.";

    if (!form.featuredImage.trim()) newErrors.featuredImage = "Featured Image URL is required.";
    else if (!/^https?:\/\/.+/.test(form.featuredImage))
      newErrors.featuredImage = "Featured Image must be a valid URL.";

    if (!form.category.trim()) newErrors.category = "Category ID is required.";
    if (!form.author.trim()) newErrors.author = "Author ID is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (editPost) {
        // Update post locally (optimistic UI)
        const updatedPosts = posts.map((p) =>
          p._id === editPost._id ? { ...p, ...form } : p
        );
        setPosts(updatedPosts);

        // Call API
        await createPost({ ...form, _id: editPost._id }); // optionally handle update via API if separate endpoint
        alert("Post updated successfully!");
      } else {
        // Create post using optimistic UI inside context
        await createPost(form);
        alert("Post created successfully!");
      }

      navigate("/");
    } catch (err) {
      console.error("Error submitting form:", err);
      alert(err.response?.data?.message || "Error submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <form onSubmit={handleSubmit} className="p-8 max-w-lg mx-auto bg-gray-800 rounded-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-white">
          {editPost ? "Edit Post" : "Create Post"}
        </h2>

        {/* TITLE */}
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full mb-2 p-3 border border-gray-300 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none bg-gray-700"
        />
        {errors.title && <p className="text-red-400 text-sm mb-4">{errors.title}</p>}

        {/* CONTENT */}
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Content"
          className="w-full mb-2 p-3 border border-gray-300 rounded-lg h-40 text-white focus:ring-2 focus:ring-blue-500 outline-none bg-gray-700"
        />
        {errors.content && <p className="text-red-400 text-sm mb-4">{errors.content}</p>}

        {/* FEATURED IMAGE */}
        <input
          name="featuredImage"
          value={form.featuredImage}
          onChange={handleChange}
          placeholder="Featured Image URL"
          className="w-full mb-2 p-3 border border-gray-300 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none bg-gray-700"
        />
        {errors.featuredImage && <p className="text-red-400 text-sm mb-4">{errors.featuredImage}</p>}

        {/* CATEGORY */}
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category ID"
          className="w-full mb-2 p-3 border border-gray-300 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none bg-gray-700"
        />
        {errors.category && <p className="text-red-400 text-sm mb-4">{errors.category}</p>}

        {/* AUTHOR */}
        <input
          name="author"
          value={form.author}
          onChange={handleChange}
          placeholder="Author ID"
          className="w-full mb-2 p-3 border border-gray-300 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none bg-gray-700"
        />
        {errors.author && <p className="text-red-400 text-sm mb-4">{errors.author}</p>}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition ${
            loading && "opacity-50 cursor-not-allowed"
          }`}
        >
          {loading ? "Saving..." : editPost ? "Update Post" : "Create Post"}
        </button>
      </form>
    </div>
  );
}
