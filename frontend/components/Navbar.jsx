"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProfileMenu from "./ProfileMenu";

export default function Navbar({ onMenuClick }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("title", query.trim());
    router.push(`/?${params.toString()}`);
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-200 bg-white px-4">
      {onMenuClick && (
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}

      <Link href="/" className="whitespace-nowrap text-lg font-semibold text-blue-600">
        BlogSpace
      </Link>

      <form onSubmit={handleSearch} className="hidden max-w-md flex-1 sm:block">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search blogs..."
          className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
        />
      </form>

      <div className="ml-auto flex items-center gap-3">
        {loading ? null : user ? (
          <ProfileMenu user={user} />
        ) : (
          <>
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600">
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
