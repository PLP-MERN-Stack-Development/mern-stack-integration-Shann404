import PostList from "../components/PostList";

export default function PostsPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-10 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-white mb-10">
          All Posts
        </h1>

        <PostList />
      </div>
    </div>
  );
}
