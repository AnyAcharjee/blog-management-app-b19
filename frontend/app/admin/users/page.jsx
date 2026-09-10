"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { usersApi, getErrorMessage } from "../../../lib/api";
import Loader from "../../../components/Loader";
import AccessDenied from "../../../components/AccessDenied";
import UserDetailsModal from "../../../components/UserDetailsModal";

export default function AdminUsersPage() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [viewUserId, setViewUserId] = useState(null);

  useEffect(() => {
    if (!token) return;
    usersApi
      .getUsers(token)
      .then((data) => setUsers(data.users || []))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [token]);

  async function toggleActive(targetUser) {
    setUpdatingId(targetUser.id);
    try {
      const { user: updated } = await usersApi.updateUserStatus(token, targetUser.id, !targetUser.isActive);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err) {
      setError(err);
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) return <Loader label="Loading users..." />;

  if (error) {
    if (error.status === 403) {
      return <AccessDenied message="You must be an administrator to view this page." />;
    }
    return <p className="text-sm text-red-600">Failed to load users: {getErrorMessage(error)}</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Users</h1>

      {users.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">No users found.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3">
                    <span className={u.isActive ? "text-green-600" : "text-gray-400"}>
                      {u.isActive ? "Active" : "Deactivated"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setViewUserId(u.id)}
                        className="text-sm font-medium text-gray-600 hover:underline"
                      >
                        View
                      </button>
                      {u.id !== user.id && (
                        <button
                          type="button"
                          onClick={() => toggleActive(u)}
                          disabled={updatingId === u.id}
                          className="text-sm font-medium text-blue-600 hover:underline disabled:opacity-60"
                        >
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <UserDetailsModal userId={viewUserId} token={token} onClose={() => setViewUserId(null)} />
    </div>
  );
}
