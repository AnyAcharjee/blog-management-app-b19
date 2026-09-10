"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { blogsApi, getErrorMessage } from "../../lib/api";
import Loader from "../../components/Loader";

function StatCard({ label, value, className = "" }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className={`mt-1 text-xl font-semibold text-gray-900 ${className}`}>{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    blogsApi
      .getAll()
      .then((data) => setBlogs(data.blogs || []))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const myBlogs = user?.role === "admin" ? blogs : blogs.filter((b) => b.author?.id === user?.id);
  const recentBlogs = myBlogs.slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.firstName}</h1>
      <p className="mt-1 text-sm text-gray-500">Here&apos;s what&apos;s happening with your blogs.</p>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="mt-6 text-sm text-red-600">{error}</p>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard label={user?.role === "admin" ? "Total Blogs" : "My Blogs"} value={myBlogs.length} />
            <StatCard label="Role" value={user?.role} className="capitalize" />
            <StatCard label="Status" value={user?.isActive ? "Active" : "Deactivated"} />
          </div>

          <div className="mt-8 flex flex-col gap-6 lg:flex-row">
            <section className="flex-1 rounded-lg border border-gray-200 bg-white p-5">
              <h2 className="text-sm font-semibold text-gray-900">Profile Information</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Name</dt>
                  <dd>
                    {user?.firstName} {user?.lastName}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Email</dt>
                  <dd>{user?.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Role</dt>
                  <dd className="capitalize">{user?.role}</dd>
                </div>
              </dl>
              <Link
                href="/dashboard/profile"
                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
              >
                Edit Profile →
              </Link>
            </section>

            <section className="flex-1 rounded-lg border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900">Recent Blogs</h2>
                <Link
                  href="/dashboard/blogs/create"
                  className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                >
                  + Create Blog
                </Link>
              </div>
              <ul className="mt-3 divide-y divide-gray-100">
                {recentBlogs.length === 0 && (
                  <li className="py-3 text-sm text-gray-500">No blogs yet.</li>
                )}
                {recentBlogs.map((blog) => (
                  <li key={blog.id} className="flex items-center justify-between py-3">
                    <Link
                      href={`/blogs/${blog.id}`}
                      className="text-sm font-medium text-gray-700 hover:text-blue-600"
                    >
                      {blog.blogTitle}
                    </Link>
                    <span className="text-xs text-gray-400">{blog.category}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
