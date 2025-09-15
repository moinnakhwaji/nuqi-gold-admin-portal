import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLoginMutation } from "../../redux/slices/auth/authApi";

const LoginPage = ({ onSignIn }) => {
  const { error: sliceError, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const [login, { isLoading, error: loginError }] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle successful login
  useEffect(() => {
    if (isAuthenticated && onSignIn) {
      onSignIn();
    }
  }, [isAuthenticated, onSignIn]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    login({ ...formData, role: "admin" });
  };

  // --- WHITE THEME CHANGES START ---
  const containerBg =
    "bg-white text-gray-800 border border-gray-200 shadow-lg"; // Lighter container
  const inputClasses =
    "w-full px-3 py-2 rounded-md transition-colors duration-200 focus:outline-none bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:border-cyan-500 focus:bg-white"; // Lighter inputs
  const logoSrc = "/nuqigoldlogo.png"; // Assuming a dark-compatible logo or adjusting if needed
  const pageBg = "bg-gradient-to-br from-gray-100 via-white to-gray-100"; // Light page background
  // --- WHITE THEME CHANGES END ---

  return (
    <div className={`flex items-center justify-center min-h-screen ${pageBg}`}>
      <div
        className={`${containerBg} p-8 rounded-2xl shadow-xl w-[420px] mx-auto`}
      >
        <div className="flex flex-col items-center justify-center">
          <img src={logoSrc} alt="Nuqi Logo" className="h-16 w-16 object-cover" />
        </div>

        {(loginError || sliceError) && (
          // Adjusted error message for light theme
          <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 border border-red-300">
            {loginError?.data?.message || sliceError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-2 text-gray-700" // Darker label text
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2 text-gray-700" // Darker label text
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800/50 text-white"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;