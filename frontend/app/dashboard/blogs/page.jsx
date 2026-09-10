"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { blogsApi, getErrorMessage } from "../../../lib/api";
import Loader from "../../../components/Loader";
import ConfirmDialog from "../../../components/ConfirmDialog";

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogsListPage() {
  const { user, token } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const loadBlogs = useCallback(() => {
    setLoading(true);
    blogsApi
      .getAll()
      .then((data) => setBlogs(data.blogs || []))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  const visibleBlogs =
    user?.role === "admin" ? blogs : blogs.filter((b) => b.author?.id === user?.id);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await blogsApi.remove(token, deleteTarget.id);
      setBlogs((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      setFeedback("Blog deleted successfully.");
      setDeleteTarget(null);
    } catch (err) {
      setFeedback(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {user?.role === "admin" ? "All Blogs" : "My Blogs"}
        </h1>
        <Link
          href="/dashboard/blogs/create"
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Create Blog
        </Link>
      </div>

      {feedback && <p className="mt-4 text-sm text-green-600">{feedback}</p>}

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="mt-6 text-sm text-red-600">{error}</p>
      ) : visibleBlogs.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">
          {user?.role === "admin" ? "No blogs found." : "You haven't created any blogs yet."}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleBlogs.map((blog) => (
                <tr key={blog.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/blogs/${blog.id}`} className="font-medium text-gray-800 hover:text-blue-600">
                      {blog.blogTitle}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{blog.category}</td>
                  <td className="px-4 py-3">
                    {blog.author ? `${blog.author.firstname} ${blog.author.lastname}` : "—"}
                  </td>
                  <td className="px-4 py-3">{formatDate(blog.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link
                        href={`/dashboard/blogs/${blog.id}/edit`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(blog)}
                        className="font-medium text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete blog"
        message={`Are you sure you want to delete "${deleteTarget?.blogTitle}"?`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
