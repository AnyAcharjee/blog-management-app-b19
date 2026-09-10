"use client";

import { useRef, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { usersApi, resolveImageUrl, getErrorMessage } from "../../../lib/api";

const inputClass =
  "w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export default function ProfilePage() {
  const { user, token, setUser } = useAuth();

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(null);

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  const avatarSrc = resolveImageUrl(user?.profileImage) || "/default-avatar.svg";

  function handleChange(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function validateProfile() {
    const next = {};
    if (!form.firstName.trim()) next.firstName = "First name is required";
    if (!form.lastName.trim()) next.lastName = "Last name is required";
    setProfileErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);
    if (!validateProfile()) return;

    setSavingProfile(true);
    try {
      const { user: updated } = await usersApi.updateProfile(token, {
        firstname: form.firstName.trim(),
        lastname: form.lastName.trim(),
      });
      setUser(updated);
      setProfileSuccess("Profile updated successfully.");
    } catch (err) {
      setProfileError(getErrorMessage(err));
    } finally {
      setSavingProfile(false);
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0] || null;
    setImageError(null);
    setUploadSuccess(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setImageError("Only JPEG, PNG, or WEBP images are allowed");
      setSelectedFile(null);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setImageError("Image must be smaller than 2MB");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedFile) {
      setImageError("Please choose an image first");
      return;
    }

    setUploading(true);
    setImageError(null);
    setUploadSuccess(null);
    try {
      const { user: updated } = await usersApi.uploadProfileImage(token, selectedFile);
      setUser(updated);
      setUploadSuccess("Profile image updated.");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setImageError(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row">
        <section className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-5 lg:w-80">
          <h2 className="text-sm font-semibold text-gray-900">Profile Image</h2>
          <div className="mt-4 flex flex-col items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarSrc}
              alt="Current avatar"
              className="h-24 w-24 rounded-full bg-gray-100 object-cover"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-600"
            />
            {imageError && <p className="text-xs text-red-600">{imageError}</p>}
            {uploadSuccess && <p className="text-xs text-green-600">{uploadSuccess}</p>}
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
            <p className="text-center text-xs text-gray-400">JPEG, PNG, or WEBP. Max 2MB.</p>
          </div>
        </section>

        <section className="flex-1 rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-900">Profile Information</h2>

          <form onSubmit={handleProfileSubmit} className="mt-4 flex max-w-md flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
              First Name
              <input value={form.firstName} onChange={handleChange("firstName")} className={inputClass} />
              {profileErrors.firstName && (
                <span className="text-xs font-normal text-red-600">{profileErrors.firstName}</span>
              )}
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
              Last Name
              <input value={form.lastName} onChange={handleChange("lastName")} className={inputClass} />
              {profileErrors.lastName && (
                <span className="text-xs font-normal text-red-600">{profileErrors.lastName}</span>
              )}
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
              Email
              <input
                value={user?.email || ""}
                readOnly
                disabled
                className={`${inputClass} cursor-not-allowed bg-gray-50 text-gray-400`}
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
              Role
              <input
                value={user?.role || ""}
                readOnly
                disabled
                className={`${inputClass} cursor-not-allowed bg-gray-50 text-gray-400 capitalize`}
              />
            </label>

            {profileError && <p className="text-sm text-red-600">{profileError}</p>}
            {profileSuccess && <p className="text-sm text-green-600">{profileSuccess}</p>}

            <button
              type="submit"
              disabled={savingProfile}
              className="self-start rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {savingProfile ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
