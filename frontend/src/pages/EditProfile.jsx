import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import axios from "../api/axios";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  const [profile, setProfile] = useState({
    name: "",
    username: "",
    bio: "",
    email: "",
    avatar: "/default-avatar.png",
  });

  useEffect(() => {
    if (user) {
      const avatarUrl = user.profilePicture 
        ? `http://localhost:5001${user.profilePicture}`
        : user.image ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email || "User")}&background=4f46e5&color=fff`;
      
      setProfile({
        name: user.name || user.email?.split("@")[0] || "",
        username: user.username || user.name || user.email?.split("@")[0] || "",
        bio: user.bio || "",
        email: user.email || "",
        avatar: avatarUrl,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setProfile({ ...profile, avatar: imageUrl });
      setUploadedFile(file);
      setError("");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Upload profile picture if a new one was selected
      if (uploadedFile) {
        const formData = new FormData();
        formData.append("profilePicture", uploadedFile);

        const uploadResponse = await axios.post("/api/auth/profile-picture", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Update user context with new profile picture
        const updatedUser = {
          ...user,
          profilePicture: uploadResponse.data.user.profilePicture,
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      // Note: For name, username, bio updates, you would need additional API endpoints
      // For now, just updating locally
      const updated = {
        ...user,
        name: profile.name,
        username: profile.username,
        bio: profile.bio,
      };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      
      navigate("/profile");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 py-10 px-4">
      {/* Back Button */}
      <div className="w-full max-w-xl mb-6">
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </button>
      </div>

      {/* Form Container */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-full max-w-xl">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Edit Profile
        </h2>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <img
              src={profile.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover mb-3"
            />
            <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-2 rounded-lg flex items-center gap-2 transition">
              <Upload className="h-4 w-4" />
              <span>Change Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>

          {/* Email (readonly) */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              readOnly
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-5 py-2 border rounded-lg font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;