import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login, user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/profile");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(email, password);
    if (result.success) {
      navigate("/profile");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 relative">
        <button
          onClick={() => navigate("/")}
          className="absolute -top-11 left-0 flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          Login to Your Account
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
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

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-medium transition-all"
          >
            Login
          </button>
        </form>

        <div className="flex justify-between items-center mt-4 text-sm">
          <button className="text-indigo-600 hover:underline dark:text-indigo-400">
            Forgot Password?
          </button>
          <button
            onClick={() => navigate("/register")}
            className="text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;