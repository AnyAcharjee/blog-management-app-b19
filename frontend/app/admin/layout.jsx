"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "../../components/DashboardShell";
import AccessDenied from "../../components/AccessDenied";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <DashboardShell>
      {user.role === "admin" ? (
        children
      ) : (
        <AccessDenied message="You must be an administrator to view this page." />
      )}
    </DashboardShell>
  );
}
