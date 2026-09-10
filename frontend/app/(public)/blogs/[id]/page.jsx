import Link from "next/link";
import { blogsApi, resolveImageUrl } from "../../../../lib/api";

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogDetailsPage({ params }) {
  const { id } = await params;

  let blog = null;
  let notFound = false;
  let errorMessage = null;

  try {
    const data = await blogsApi.getById(id);
    blog = data.blog;
  } catch (err) {
    if (err.status === 404) {
      notFound = true;
    } else {
      errorMessage = err.message;
    }
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Blog Not Found</h1>
        <p className="mt-2 text-sm text-gray-500">
          The blog you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm font-medium text-blue-600 hover:underline">
          ← Back to all blogs
        </Link>
      </div>
    );
  }

  if (errorMessage || !blog) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
        <p className="mt-2 text-sm text-gray-500">{errorMessage || "Unable to load this blog."}</p>
      </div>
    );
  }

  const authorName = blog.author
    ? `${blog.author.firstname} ${blog.author.lastname}`
    : "Unknown Author";
  const authorImage = resolveImageUrl(blog.author?.profileImage) || "/default-avatar.svg";

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
        {blog.category}
      </span>
      <h1 className="mt-3 text-3xl font-bold text-gray-900">{blog.blogTitle}</h1>

      <div className="mt-4 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={authorImage}
          alt={authorName}
          className="h-10 w-10 rounded-full bg-gray-100 object-cover"
        />
        <div>
          <p className="text-sm font-medium text-gray-700">{authorName}</p>
          <p className="text-xs text-gray-400">{formatDate(blog.createdAt)}</p>
        </div>
      </div>

      <div className="mt-6 whitespace-pre-line text-base leading-relaxed text-gray-700">
        {blog.blog}
      </div>

      <Link href="/" className="mt-8 inline-block text-sm font-medium text-blue-600 hover:underline">
        ← Back to all blogs
      </Link>
    </article>
  );
}
