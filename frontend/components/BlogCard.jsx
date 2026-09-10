import Link from "next/link";
import { resolveImageUrl } from "../lib/api";

function truncate(text, length = 140) {
  if (!text) return "";
  return text.length > length ? `${text.slice(0, length).trim()}…` : text;
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogCard({ blog }) {
  const authorName = blog.author
    ? `${blog.author.firstname} ${blog.author.lastname}`
    : "Unknown Author";
  const authorImage = resolveImageUrl(blog.author?.profileImage) || "/default-avatar.svg";

  return (
    <article className="flex flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <span className="mb-2 inline-block w-fit rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
        {blog.category}
      </span>
      <h2 className="text-lg font-semibold text-gray-900">{blog.blogTitle}</h2>
      <p className="mt-2 flex-1 text-sm text-gray-500">{truncate(blog.blog)}</p>

      <div className="mt-4 flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={authorImage}
          alt={authorName}
          className="h-6 w-6 rounded-full bg-gray-100 object-cover"
        />
        <span className="text-xs font-medium text-gray-600">{authorName}</span>
        <span className="text-xs text-gray-400">· {formatDate(blog.createdAt)}</span>
      </div>

      <Link
        href={`/blogs/${blog.id}`}
        className="mt-4 inline-flex items-center justify-center rounded-md border border-blue-600 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
      >
        Read More
      </Link>
    </article>
  );
}
