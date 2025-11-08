// File: src/components/ExportCSVButtonTwo.js

import React, { useState } from "react";
import { FaDownload, FaSpinner } from "react-icons/fa";
// If you store the token in Redux, you will need this hook:
import { useSelector } from "react-redux";

const ExportCSVButtonTwo = ({
  filename = "export-records.csv",
  buttonText = "Export to CSV",
  currentFilters,
}) => {
  const [isFetching, setIsFetching] = useState(false);

  // --- METHOD 1: Get the token from Redux State ---
  // Replace 'auth.token' with the actual path to your token in the Redux store.
  // const token = useSelector((state) => state.auth.token);

  const handleExport = async () => {
    setIsFetching(true);

    const token = useSelector((state) => state.auth.token);
    if (!token) {
      alert("Authentication error: No token found. Please log in again.");
      setIsFetching(false);
      return;
    }

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000/api';
    const endpoint = `${API_BASE_URL}/operations/transactions/all`;
    const params = new URLSearchParams({ export: "csv" });
    
    // ... (Your code to build the params is correct)
    if (currentFilters.search) params.append('search', currentFilters.search);
    if (currentFilters.status && currentFilters.status !== 'all') params.append('status', currentFilters.status);
    if (currentFilters.startDate) params.append('startDate', currentFilters.startDate);
    if (currentFilters.endDate) params.append('endDate', currentFilters.endDate);
    if (currentFilters.sortField) params.append('sortField', currentFilters.sortField);
    if (currentFilters.sortDirection) params.append('sortDirection', currentFilters.sortDirection);

    const fullUrl = `${endpoint}?${params.toString()}`;
    console.log("Requesting CSV with authentication from:", fullUrl);

    try {
      // --- THIS IS THE FIX ---
      // We are adding the 'headers' option to the fetch request.
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // This sends the token to the backend
          'Content-Type': 'application/json', // Optional, but good practice
        },
      });

      if (!response.ok) {
        // Provide a more helpful error for authentication issues
        if (response.status === 401) {
          throw new Error('Unauthorized: Your session may have expired. Please log in again.');
        }
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const fileBlob = await response.blob();
      
      if (!fileBlob || fileBlob.size === 0) {
        alert("Export failed: Received an empty file from the server.");
        setIsFetching(false);
        return;
      }

      const url = window.URL.createObjectURL(fileBlob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

    } catch (error) {
      console.error("The fetch operation failed:", error);
      alert(`An error occurred during the export: ${error.message}`);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isFetching}
      className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-green-600 border border-transparent rounded-lg shadow-lg"
    >
      <div className="relative flex items-center space-x-2">
        {isFetching ? <FaSpinner className="w-5 h-5 animate-spin" /> : <FaDownload className="w-5 h-5" />}
        <span>{isFetching ? "Generating..." : buttonText}</span>
      </div>
    </button>
  );
};

 export default ExportCSVButtonTwo;