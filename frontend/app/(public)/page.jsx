import BlogFilters from "../../components/BlogFilters";
import BlogCard from "../../components/BlogCard";
import { blogsApi } from "../../lib/api";

export default async function HomePage({ searchParams }) {
  const params = await searchParams;
  const title = params?.title || "";
  const category = params?.category || "";

  let blogs = [];
  let categories = [];
  let error = null;

  try {
    const [filteredData, allData] = await Promise.all([
      blogsApi.getAll({ title, category }),
      blogsApi.getAll(),
    ]);
    blogs = filteredData.blogs || [];
    categories = Array.from(new Set((allData.blogs || []).map((b) => b.category))).sort();
  } catch (err) {
    error = err.message;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Browse Blogs</h1>
      <BlogFilters initialTitle={title} initialCategory={category} categories={categories} />

      {error && (
        <p className="mt-6 text-sm text-red-600">Failed to load blogs: {error}</p>
      )}

      {!error && blogs.length === 0 && (
        <p className="mt-6 text-sm text-gray-500">No blogs found.</p>
      )}

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
}
