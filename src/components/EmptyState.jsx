import React from "react";
import { useStateContext } from "../contexts/ContextProvider";

// Default wallet icon component
const WalletIcon = ({ currentMode }) => (
  <svg
    className={`w-16 h-16 ${
      currentMode === "Dark" ? "text-cyan-400" : "text-cyan-600"
    }`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  </svg>
);

// Document icon for KYC, orders, etc.
const DocumentIcon = ({ currentMode }) => (
  <svg
    className={`w-16 h-16 ${
      currentMode === "Dark" ? "text-cyan-400" : "text-cyan-600"
    }`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

// Users icon for user management pages
const UsersIcon = ({ currentMode }) => (
  <svg
    className={`w-16 h-16 ${
      currentMode === "Dark" ? "text-cyan-400" : "text-cyan-600"
    }`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m3 5.197H15M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

// Portfolio/basket icon for portfolio pages
const PortfolioIcon = ({ currentMode }) => (
  <svg
    className={`w-16 h-16 ${
      currentMode === "Dark" ? "text-cyan-400" : "text-cyan-600"
    }`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg
    className="w-16 h-16 text-red-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
    />
  </svg>
);

const EmptyState = ({
  title = "No Records Available Yet",
  message = "Records will appear here once they are created.",
  icon: CustomIcon,
  iconType = "wallet",
  showRefreshButton = true,
  onRefresh,
  buttonText = "Refresh Page",
  className = "",
  variant = "empty",
}) => {
  const { currentMode } = useStateContext();

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  const isError = variant === "error";

  // Helper functions to avoid nested ternaries
  const getContainerClasses = () => {
    if (isError) {
      return currentMode === "Dark"
        ? "bg-red-500/10 border border-red-500/30"
        : "bg-red-50 border border-red-200";
    }
    return currentMode === "Dark"
      ? "bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/30"
      : "bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 border border-cyan-200";
  };

  const getIconComponent = () => {
    if (CustomIcon) return <CustomIcon />;
    if (isError) return <ErrorIcon />;

    // Return appropriate icon based on iconType
    switch (iconType) {
      case "document":
        return <DocumentIcon currentMode={currentMode} />;
      case "users":
        return <UsersIcon currentMode={currentMode} />;
      case "portfolio":
        return <PortfolioIcon currentMode={currentMode} />;
      case "wallet":
      default:
        return <WalletIcon currentMode={currentMode} />;
    }
  };

  const getTitleClasses = () => {
    if (isError) {
      return currentMode === "Dark" ? "text-red-400" : "text-red-600";
    }
    const gradientClasses =
      currentMode === "Dark"
        ? "from-cyan-400 via-blue-400 to-purple-400"
        : "from-cyan-600 via-blue-600 to-purple-600";
    return `bg-gradient-to-r ${gradientClasses} text-transparent bg-clip-text`;
  };

  const getButtonClasses = () => {
    if (isError) {
      return "bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
    }
    return currentMode === "Dark"
      ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg hover:shadow-cyan-500/25"
      : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg hover:shadow-blue-500/25";
  };

  return (
    <div className={`flex items-center justify-center min-h-96 ${className}`}>
      <div className="text-center max-w-md mx-auto">
        {/* Icon Container */}
        <div className="mb-8">
          <div
            className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center ${getContainerClasses()}`}
          >
            {getIconComponent()}
          </div>
        </div>

        {/* Title */}
        <h2 className={`text-3xl font-bold mb-4 ${getTitleClasses()}`}>
          {title}
        </h2>

        {/* Message */}
        <p
          className={`text-lg mb-8 ${
            currentMode === "Dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {message}
        </p>

        {/* Action Button */}
        {showRefreshButton && (
          <button
            type="button"
            onClick={handleRefresh}
            className={`inline-flex items-center px-6 py-3 rounded-md font-medium transition-all duration-200 ${getButtonClasses()}`}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
