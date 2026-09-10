"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BlogForm from "../../../../components/BlogForm";
import { useAuth } from "../../../../context/AuthContext";
import { blogsApi, getErrorMessage } from "../../../../lib/api";

export default function CreateBlogPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(values) {
    setError(null);
    setSubmitting(true);
    try {
      await blogsApi.create(token, values);
      router.push("/dashboard/blogs");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Create Blog</h1>
      <div className="mt-6 max-w-2xl">
        <BlogForm onSubmit={handleSubmit} submitting={submitting} error={error} submitLabel="Publish Blog" />
      </div>
    </div>
  );
}
