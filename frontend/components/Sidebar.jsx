"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const userLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/blogs", label: "My Blogs" },
  { href: "/dashboard/blogs/create", label: "Create Blog" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/change-password", label: "Change Password" },
];

const adminLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/blogs", label: "All Blogs" },
  { href: "/dashboard/blogs/create", label: "Create Blog" },
  { href: "/admin/users", label: "Users" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/change-password", label: "Change Password" },
];

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const items = user?.role === "admin" ? adminLinks : userLinks;

  function handleLogout() {
    onClose?.();
    logout();
    router.push("/login");
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-16 z-30 flex h-[calc(100vh-4rem)] w-56 flex-col justify-between border-r border-gray-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col gap-1 p-3">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={
                  active
                    ? "rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600"
                    : "rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
