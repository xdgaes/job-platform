import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Scissors, Video } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register, user} = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentRole, setCurrentRole] = useState("clipper");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/profile");
    }
  }, [user, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const result = await register(name, email, password, currentRole);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate("/profile"), 1000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 relative">
        <button
          onClick={() => navigate("/login")}
          className="absolute -top-11 left-0 flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-gray-100">
          Create an Account
        </h2>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
          Join as a Clipper or Creator
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">I want to join as:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCurrentRole("clipper")}
                className={`relative p-4 border-2 rounded-lg transition-all ${
                  currentRole === "clipper"
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-indigo-400"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Scissors
                    className={`w-8 h-8 ${
                      currentRole === "clipper"
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  />
                  <span
                    className={`font-semibold text-sm ${
                      currentRole === "clipper"
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Clipper
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Create clips & earn
                  </span>
                </div>
                {currentRole === "clipper" && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setCurrentRole("creator")}
                className={`relative p-4 border-2 rounded-lg transition-all ${
                  currentRole === "creator"
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-indigo-400"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Video
                    className={`w-8 h-8 ${
                      currentRole === "creator"
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  />
                  <span
                    className={`font-semibold text-sm ${
                      currentRole === "creator"
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Creator
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Get clips made
                  </span>
                </div>
                {currentRole === "creator" && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && (
            <p className="text-green-500 text-sm text-center">
              Account created! Redirecting...
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-medium transition-all"
          >
            Register as {currentRole === "clipper" ? "Clipper" : "Creator"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;