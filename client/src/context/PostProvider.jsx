// src/context/PostProvider.jsx
import { useState, useEffect, useCallback } from "react";
import { PostContext } from "./PostContext";
import { postService, categoryService } from "../services/api";

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPost = async (form) => {
    const newPost = { ...form, _id: Date.now() }; // temporary id for optimistic UI
    setPosts((prev) => [newPost, ...prev]); // optimistic update

    try {
      const res = await postService.createPost(form);
      setPosts((prev) =>
        prev.map((p) => (p._id === newPost._id ? res.data : p))
      );
    } catch (err) {
      console.error("Failed to create post:", err);
      // revert if failed
      setPosts((prev) => prev.filter((p) => p._id !== newPost._id));
      throw err;
    }
  };

  // useCallback so consumers can safely call fetchPosts in useEffect deps
  const fetchPosts = useCallback(async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const res = await postService.getAllPosts(page, limit);
      // postService.getAllPosts should return the object your backend sends.
      // It might be `res` = array or { posts: [...], total: n }, adjust accordingly:
      const postsData = Array.isArray(res) ? res : res.posts ?? res.data ?? [];
      setPosts(postsData);
    } catch (err) {
      console.error("fetchPosts error:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
const res = await categoryService.getAllCategories();
   
      setCategories(res || []);
    } catch (err) {
      console.error("fetchCategories error:", err);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [fetchPosts, fetchCategories]);

  return (
    <PostContext.Provider
      value={{ posts, categories, loading, error, fetchPosts, setPosts }}
    >
      {children}
    </PostContext.Provider>
  );
}
