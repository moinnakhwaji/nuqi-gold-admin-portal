import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/auth/authSlice";
import { useStateContext } from "../contexts/ContextProvider";

const LogoutConfirmationModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentMode } = useStateContext();

  const handleLogout = () => {
    // Dispatch logout action to clear Redux state
    dispatch(logout());
    // Navigate to home page
    navigate("/");
    // Close the modal
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  const containerBg =
    currentMode === "Dark"
      ? "bg-gradient-to-br from-black via-slate-900 to-black text-gray-100 border border-gray-700/60"
      : "bg-white text-gray-900 border border-gray-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative z-10 w-11/12 max-w-md rounded-2xl ${containerBg} shadow-xl p-6`}
      >
        <div className="text-center">
          {/* Icon */}
          <div
            className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
              currentMode === "Dark" ? "bg-red-900/40" : "bg-red-100"
            } mb-4`}
          >
            <svg
              className={`h-6 w-6 ${
                currentMode === "Dark" ? "text-red-300" : "text-red-600"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold mb-2">Confirm Logout</h3>

          {/* Message */}
          <p className="text-sm opacity-80 mb-6">
            Are you sure you want to logout? You will be redirected to the login
            page.
          </p>

          {/* Buttons */}
          <div className="flex justify-center space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentMode === "Dark"
                  ? "bg-black/40 text-gray-300 border border-gray-700/60 hover:bg-black/60"
                  : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
              } transition-colors duration-200`}
            >
              No, Cancel
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200"
            >
              Yes, Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;
