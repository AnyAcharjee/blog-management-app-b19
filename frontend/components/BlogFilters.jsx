"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BlogFilters({ initialTitle = "", initialCategory = "", categories = [] }) {
  const options = ["All", ...categories];
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [category, setCategory] = useState(initialCategory || "All");

  useEffect(() => {
    setTitle(initialTitle);
    setCategory(initialCategory || "All");
  }, [initialTitle, initialCategory]);

  function updateParams(nextTitle, nextCategory) {
    const params = new URLSearchParams();
    if (nextTitle.trim()) params.set("title", nextTitle.trim());
    if (nextCategory && nextCategory !== "All") params.set("category", nextCategory);
    router.push(`/?${params.toString()}`);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    updateParams(title, category);
  }

  function handleCategoryChange(e) {
    const value = e.target.value;
    setCategory(value);
    updateParams(title, value);
  }

  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2">
        <input
          type="search"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Search blogs..."
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      <select
        value={category}
        onChange={handleCategoryChange}
        className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      >
        {options.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
