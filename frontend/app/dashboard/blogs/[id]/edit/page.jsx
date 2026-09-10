"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BlogForm from "../../../../../components/BlogForm";
import Loader from "../../../../../components/Loader";
import AccessDenied from "../../../../../components/AccessDenied";
import { useAuth } from "../../../../../context/AuthContext";
import { blogsApi, getErrorMessage } from "../../../../../lib/api";

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    blogsApi
      .getById(id)
      .then((data) => setBlog(data.blog))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader label="Loading blog..." />;

  if (error) {
    if (error.status === 404) {
      return <p className="text-sm text-gray-500">Blog not found.</p>;
    }
    return <p className="text-sm text-red-600">{getErrorMessage(error)}</p>;
  }

  const isOwner = blog?.author?.id === user?.id;
  const canEdit = isOwner || user?.role === "admin";

  if (!canEdit) {
    return <AccessDenied message="You can only edit your own blogs." />;
  }

  async function handleSubmit(values) {
    setSubmitError(null);
    setSubmitting(true);
    try {
      await blogsApi.update(token, id, values);
      router.push("/dashboard/blogs");
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Edit Blog</h1>
      <div className="mt-6 max-w-2xl">
        <BlogForm
          initialValues={blog}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={submitError}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
