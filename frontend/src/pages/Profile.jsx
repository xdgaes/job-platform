import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { X } from "lucide-react";

function Profile() {
  const { user, logout, toggleMode, mode, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    image: "",
  });

  // Redirect ke login jika user belum login
  useEffect(() => {
    if (!user) navigate("/login");
    else {
      // Initialize profile data dari user context
      setProfileData({
        name: user.name || user.email.split("@")[0],
        bio: user.bio || "Hey there! I’m using CLIPPA.",
        image:
          user.image ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=4f46e5&color=fff`,
      });
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSave = () => {
    // Update context + localStorage
    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("Profile updated successfully!");
    setEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition">
      {/* CONTENT */}
      <div className="max-w-4xl mx-auto mt-10 bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-semibold mb-6">Profile</h1>
        <div className="flex items-center gap-6">
          <img
            src={profileData.image}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-indigo-600 dark:border-indigo-500"
          />
          <div>
            <h2 className="text-2xl font-semibold">{profileData.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{profileData.bio}</p>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <h3 className="text-lg font-medium mb-2">General Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Email</p>
              <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
            </div>
            <div>
              <p className="font-medium">Account Type</p>
              <p className="text-gray-600 dark:text-gray-300">{mode}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setEditModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium"
          >
            Edit Profile
          </button>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="text-red-500 hover:text-red-600 font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-300"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  name="bio"
                  rows="3"
                  value={profileData.bio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Profile Picture URL</label>
                <input
                  type="text"
                  name="image"
                  value={profileData.image}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;