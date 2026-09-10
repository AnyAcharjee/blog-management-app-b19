import Link from "next/link";

export default function AccessDenied({ message = "You do not have permission to view this page." }) {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
      <p className="mt-2 text-sm text-gray-500">{message}</p>
      <Link href="/dashboard" className="mt-6 inline-block text-sm font-medium text-blue-600 hover:underline">
        ← Back to Dashboard
      </Link>
    </div>
  );
}
