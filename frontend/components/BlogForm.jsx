"use client";

import { useState } from "react";

const CATEGORY_SUGGESTIONS = [
  "Testing",
  "Automation",
  "Programming",
  "DevOps",
  "AI",
  "Education",
  "Business",
  "Politics",
];

const inputClass =
  "w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none";

export default function BlogForm({ initialValues, onSubmit, submitting, error, submitLabel = "Save" }) {
  const [form, setForm] = useState({
    blogTitle: initialValues?.blogTitle || "",
    category: initialValues?.category || "",
    blog: initialValues?.blog || "",
  });
  const [validationErrors, setValidationErrors] = useState({});

  function handleChange(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function validate() {
    const next = {};
    if (!form.blogTitle.trim()) next.blogTitle = "Blog title is required";
    if (!form.category.trim()) next.category = "Category is required";
    if (!form.blog.trim()) next.blog = "Blog content is required";
    setValidationErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
        Blog Title
        <input value={form.blogTitle} onChange={handleChange("blogTitle")} className={inputClass} />
        {validationErrors.blogTitle && (
          <span className="text-xs font-normal text-red-600">{validationErrors.blogTitle}</span>
        )}
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
        Category
        <input
          value={form.category}
          onChange={handleChange("category")}
          list="category-suggestions"
          className={inputClass}
        />
        <datalist id="category-suggestions">
          {CATEGORY_SUGGESTIONS.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        {validationErrors.category && (
          <span className="text-xs font-normal text-red-600">{validationErrors.category}</span>
        )}
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
        Blog Content
        <textarea
          value={form.blog}
          onChange={handleChange("blog")}
          rows={10}
          className={inputClass}
        />
        {validationErrors.blog && (
          <span className="text-xs font-normal text-red-600">{validationErrors.blog}</span>
        )}
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="self-start rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
