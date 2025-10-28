import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const [profile, setProfile] = useState({
    name: "",
    username: "",
    bio: "",
    email: "",
    avatar: "/default-avatar.png",
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || user.email?.split("@")[0] || "",
        username: user.username || user.name || user.email?.split("@")[0] || "",
        bio: user.bio || "",
        email: user.email || "",
        avatar:
          user.image ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email || "User")}&background=4f46e5&color=fff`,
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
      const imageUrl = URL.createObjectURL(file);
      setProfile({ ...profile, avatar: imageUrl });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...user,
      name: profile.name,
      username: profile.username,
      bio: profile.bio,
      image: profile.avatar,
    };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    navigate("/profile");
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
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;