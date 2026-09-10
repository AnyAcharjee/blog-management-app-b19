"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { authApi, getErrorMessage } from "../../../../lib/api";

const inputClass =
  "w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  function handleChange(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function validate() {
    const next = {};
    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 6) next.password = "Password must be at least 6 characters";
    if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await authApi.resetPassword(token, form.password);
      setSuccessMessage("Password successfully changed.");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (successMessage) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">{successMessage}</h1>
        <p className="mt-2 text-sm text-gray-500">Redirecting you to login...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
          New Password
          <input
            type="password"
            value={form.password}
            onChange={handleChange("password")}
            className={inputClass}
          />
          {errors.password && <span className="text-xs font-normal text-red-600">{errors.password}</span>}
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
          Confirm Password
          <input
            type="password"
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
            className={inputClass}
          />
          {errors.confirmPassword && (
            <span className="text-xs font-normal text-red-600">{errors.confirmPassword}</span>
          )}
        </label>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-500">
        <Link href="/login" className="font-medium text-blue-600 hover:underline">
          ← Back to Login
        </Link>
      </p>
    </div>
  );
}
