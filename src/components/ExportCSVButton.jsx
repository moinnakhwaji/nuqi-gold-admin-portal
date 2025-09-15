import React from "react";
import { FaDownload, FaSpinner } from "react-icons/fa";

const ExportCSVButton = ({
  filename = "export-records.csv",
  buttonText = "Export to CSV",
  currentFilters,
  exportHook, // Pass the lazy hook as a prop
}) => {
  // Use the passed export hook
  const [triggerExport, { isFetching }] = exportHook();

  const handleExport = async () => {
    try {
      const response = await triggerExport(currentFilters).unwrap();

      const url = window.URL.createObjectURL(response);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Error exporting to CSV:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isFetching}
      className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-green-600 border border-transparent rounded-lg shadow-lg hover:from-emerald-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl active:scale-95"
    >
      {/* Background shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-pulse rounded-lg" />

      {/* Icon */}
      <div className="relative flex items-center space-x-2">
        {isFetching ? (
          <FaSpinner className="w-5 h-5 animate-spin" />
        ) : (
          <FaDownload className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
        )}

        {/* Text */}
        <span className="relative">
          {isFetching ? (
            <span className="flex items-center space-x-1">
              <span>Generating</span>
              <span className="flex space-x-1">
                <span className="w-1 h-1 bg-white rounded-full animate-bounce" />
                <span
                  className="w-1 h-1 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <span
                  className="w-1 h-1 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </span>
            </span>
          ) : (
            <span className="group-hover:tracking-wide transition-all duration-200">
              {buttonText}
            </span>
          )}
        </span>
      </div>

      {/* Ripple effect on click */}
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-30 transition-opacity duration-150" />
      </div>
    </button>
  );
};

export default ExportCSVButton;